import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Ajv2020 } from 'ajv/dist/2020.js';

import {
  DOCUMENT_SCHEMAS,
  ContractError,
  canonicalJson,
  inputFingerprint,
  parseAnyDocument,
  parseDocument,
  sha256Hex,
  type DocumentSchemaName,
} from '../ts/src/index.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURES = join(ROOT, 'fixtures');
const SCHEMAS = join(ROOT, 'schemas');

const readJson = (path: string): unknown => JSON.parse(readFileSync(path, 'utf8'));

// Fixture directory → the `schema` value its documents carry.
const FIXTURE_DOCS: Record<string, DocumentSchemaName> = {
  'bar-binary-layout.v1': 'heisentick/bar-binary-layout',
  'candle-snapshot-manifest.v1': 'heisentick/candle-snapshot-manifest',
  'validation-run-manifest.v1': 'heisentick/validation-run-manifest',
  'validation-run-request.v1': 'heisentick/validation-run-request',
  'validation-run-result.v1': 'heisentick/validation-run-result',
  'validation-run-result-failed.v1': 'heisentick/validation-run-result',
  'validation-request-message.v1': 'heisentick/validation-request-message',
  'validation-result-message.v1': 'heisentick/validation-result-message',
};

// The JSON Schema files themselves, compiled with Ajv, are the reference the
// generated zod must agree with on every fixture. Ajv is a dev dependency
// only; consumers get zod.
function ajvValidators() {
  const ajv = new Ajv2020({ strict: true, allowUnionTypes: true, allErrors: true });
  for (const file of readdirSync(SCHEMAS).filter((f) => f.endsWith('.schema.json'))) {
    ajv.addSchema(readJson(join(SCHEMAS, file)) as object, file);
  }
  return {
    validate(schemaFile: string, ref: string | null, value: unknown): boolean {
      const key = ref ? `${schemaFile}#${ref}` : schemaFile;
      const fn = ajv.getSchema(key);
      assert.ok(fn, `ajv could not resolve ${key}`);
      const ok = Boolean(fn(value));
      if (!ok && process.env.AJV_DEBUG) console.error(key, JSON.stringify(fn.errors));
      return ok;
    },
  };
}

const CROSS_FIELD_FIXTURES = new Set(['succeeded-without-report.json', 'succeeded-with-null-headline.json']);

const ajvRefFor: Record<string, [string, string | null]> = {
  'bar-binary-layout.v1': ['bar-binary-layout.v1.schema.json', null],
  'candle-snapshot-manifest.v1': ['candle-snapshot-manifest.v1.schema.json', null],
  'validation-run-manifest.v1': ['validation-run-manifest.v1.schema.json', null],
  'validation-run-request.v1': ['validation-run-request.v1.schema.json', null],
  'validation-run-result.v1': ['validation-run-result.v1.schema.json', null],
  'validation-run-result-failed.v1': ['validation-run-result.v1.schema.json', null],
  'validation-request-message.v1': ['validation-queue-messages.v1.schema.json', '/$defs/validationRequestMessage'],
  'validation-result-message.v1': ['validation-queue-messages.v1.schema.json', '/$defs/validationResultMessage'],
};

test('every fixture directory is covered and every document has both valid and invalid fixtures', () => {
  const dirs = readdirSync(FIXTURES).filter((d) => d !== 'canonical').sort();
  assert.deepEqual(dirs, Object.keys(FIXTURE_DOCS).sort());
  for (const dir of dirs) {
    assert.ok(readdirSync(join(FIXTURES, dir, 'valid')).length >= 1, `${dir} has a valid fixture`);
    assert.ok(readdirSync(join(FIXTURES, dir, 'invalid')).length >= 3, `${dir} has invalid fixtures`);
  }
});

test('zod and JSON Schema agree: valid fixtures pass both, invalid fixtures fail both', () => {
  const ajv = ajvValidators();
  for (const [dir, name] of Object.entries(FIXTURE_DOCS)) {
    const [schemaFile, ref] = ajvRefFor[dir];
    for (const file of readdirSync(join(FIXTURES, dir, 'valid'))) {
      const value = readJson(join(FIXTURES, dir, 'valid', file));
      assert.equal(ajv.validate(schemaFile, ref, value), true, `${dir}/valid/${file} (json schema)`);
      assert.doesNotThrow(() => parseDocument(name, value), `${dir}/valid/${file} (zod)`);
      assert.equal(parseAnyDocument(value).schema, name);
    }
    for (const file of readdirSync(join(FIXTURES, dir, 'invalid'))) {
      const value = readJson(join(FIXTURES, dir, 'invalid', file));
      // Cross-field rules live in code, not in the schema (see crossFieldIssues).
      if (!CROSS_FIELD_FIXTURES.has(file)) {
        assert.equal(ajv.validate(schemaFile, ref, value), false, `${dir}/invalid/${file} should fail json schema`);
      }
      assert.throws(() => parseDocument(name, value), ContractError, `${dir}/invalid/${file} should fail the package`);
    }
  }
});

test('unknown fields are rejected on every document', () => {
  for (const [name, schema] of Object.entries(DOCUMENT_SCHEMAS)) {
    const dir = Object.entries(FIXTURE_DOCS).find(([, n]) => n === name)?.[0];
    assert.ok(dir, `fixture dir for ${name}`);
    const value = readJson(join(FIXTURES, dir, 'valid', 'example.json')) as Record<string, unknown>;
    assert.equal(schema.safeParse({ ...value, unexpectedField: 1 }).success, false, name);
  }
});

test('an unknown or missing schema name is a ContractError, never a pass', () => {
  assert.throws(() => parseAnyDocument({ schema: 'heisentick/nope', version: 1 }), /unknown document schema "heisentick\/nope"/);
  assert.throws(() => parseAnyDocument({ version: 1 }), /missing schema field/);
  assert.throws(() => parseAnyDocument(null), ContractError);
});

test('canonical JSON matches the committed cases and rejects non-finite numbers and undefined', () => {
  const cases = readJson(join(FIXTURES, 'canonical', 'cases.json')) as { name: string; input: unknown; canonical: string; sha256?: string }[];
  for (const c of cases) {
    assert.equal(canonicalJson(c.input), c.canonical, c.name);
    if (c.sha256) assert.equal(sha256Hex(c.canonical), c.sha256, `${c.name} sha256`);
  }
  assert.throws(() => canonicalJson({ a: Number.NaN }), /non-finite number at \.a/);
  assert.throws(() => canonicalJson({ a: [1, Infinity] }), /non-finite number at \.a\[1\]/);
  assert.throws(() => canonicalJson({ a: undefined }), /undefined value at \.a/);
  assert.equal(canonicalJson({ b: -0 }), '{"b":0}');
});

test('bounded generated canonical cases preserve cross-language vectors', () => {
  const fixture = readJson(join(FIXTURES, 'canonical', 'generated-cases.json')) as {
    algorithm: string;
    boundedCaseCount: number;
    cases: { name: string; seed: string; input: unknown; canonical: string; sha256: string }[];
    fingerprints: unknown[];
  };
  assert.equal(fixture.algorithm, 'lcg32-v1');
  assert.ok(fixture.cases.length > 0, 'generated fixture has no canonical cases');
  assert.ok(fixture.fingerprints.length > 0, 'generated fixture has no fingerprint cases');
  assert.equal(fixture.cases.length, fixture.boundedCaseCount);
  for (const c of fixture.cases) {
    assert.equal(canonicalJson(c.input), c.canonical, c.name + ' seed=' + c.seed);
    assert.equal(sha256Hex(c.canonical), c.sha256, c.name + ' seed=' + c.seed + ' sha256');
  }
});

test('generated fingerprints ignore identity and detect material changes', () => {
  const fixture = readJson(join(FIXTURES, 'canonical', 'generated-cases.json')) as {
    fingerprints: {
      name: string;
      seed: string;
      manifest: Record<string, unknown>;
      identityVariant: Record<string, unknown>;
      materialVariant: { costs: Record<string, unknown> };
      fingerprint: string;
      materialFingerprint: string;
    }[];
  };
  for (const c of fixture.fingerprints) {
    const got = inputFingerprint(c.manifest);
    assert.equal(got, c.fingerprint, c.name + ' seed=' + c.seed);
    assert.equal(inputFingerprint({ ...c.manifest, ...c.identityVariant }), got, c.name + ' identity seed=' + c.seed);
    const material = {
      ...c.manifest,
      costs: { ...(c.manifest.costs as Record<string, unknown>), ...c.materialVariant.costs },
    };
    const materialFingerprint = inputFingerprint(material);
    assert.equal(materialFingerprint, c.materialFingerprint, c.name + ' material seed=' + c.seed);
    assert.notEqual(materialFingerprint, got, c.name + ' material changed seed=' + c.seed);
  }
});

test('inputFingerprint ignores submission identity and changes with any input', () => {
  const manifest = readJson(join(FIXTURES, 'validation-run-manifest.v1', 'valid', 'example.json')) as Record<string, unknown>;
  const fp = inputFingerprint(manifest);
  assert.match(fp, /^[0-9a-f]{64}$/);
  assert.equal(inputFingerprint({ ...manifest, runId: '9f3c1d2e-4a5b-4c6d-8e9f-0a1b2c3d4e5f', submittedAt: 1, requestedBy: { subject: 'x', via: 'local' } }), fp);
  assert.notEqual(inputFingerprint({ ...manifest, costs: { ...(manifest.costs as object), slippage: 0.07 } }), fp);
  const expectedPath = join(FIXTURES, 'validation-run-manifest.v1', 'fingerprint.txt');
  if (existsSync(expectedPath)) assert.equal(fp, readFileSync(expectedPath, 'utf8').trim());
});
