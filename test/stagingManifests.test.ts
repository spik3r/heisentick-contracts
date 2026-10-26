import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { DOCUMENT_SCHEMAS, parseAnyDocument } from '../ts/src/index.js';
import { stagingManifestIssues, verifyStagedBytes, type StagedPayload } from '../ts/src/stagingIntegrity.js';

interface Manifest { schema: string; payload: StagedPayload; [key: string]: unknown }
const fixture = JSON.parse(readFileSync(new URL('./fixtures/staging-manifests.json', import.meta.url), 'utf8')) as {
  cases: { name: string; bodyHex: string; manifest: Manifest }[];
  states: { name: string; manifest: Manifest }[];
  invalidManifests: { name: string; manifest: Manifest }[];
};
for (const c of fixture.cases) test(`staging contract and production verifier: ${c.name}`, () => {
  assert.deepEqual(stagingManifestIssues(c.manifest), []);
  parseAnyDocument(c.manifest);
  const bytes = Buffer.from(c.bodyHex, 'hex');
  verifyStagedBytes(bytes, c.manifest.payload, bytes.length);
  const corrupt = Buffer.from(bytes); corrupt[0] ^= 1;
  assert.throws(() => verifyStagedBytes(corrupt, c.manifest.payload, bytes.length), /sha256-mismatch/);
  assert.throws(() => verifyStagedBytes(bytes.subarray(1), c.manifest.payload, bytes.length), /byte-length-mismatch/);
  assert.throws(() => verifyStagedBytes(bytes, c.manifest.payload, bytes.length - 1), /limit-exceeded/);
});
for (const c of fixture.states) test(`staging partial/terminal state: ${c.name}`, () => { parseAnyDocument(c.manifest); });
for (const c of fixture.invalidManifests) test(`reject staging manifest: ${c.name}`, () => {
  assert.throws(() => parseAnyDocument(c.manifest));
});

test('production Node verifier agrees with the existing Go byte-vector corpus', () => {
  const corpus = JSON.parse(readFileSync(new URL('./fixtures/staging-byte-integrity.json', import.meta.url), 'utf8')) as {
    cases: { bodyHex: string; byteLength: number; sha256: string; maxBytes: number; wantError: string | null }[];
  };
  for (const c of corpus.cases) {
    const verify = () => verifyStagedBytes(Buffer.from(c.bodyHex, 'hex'), { key: 'invented', byteLength: c.byteLength, sha256: c.sha256 }, c.maxBytes);
    if (c.wantError) assert.throws(verify, { message: `staged bytes: ${c.wantError}` });
    else verify();
  }
});


test('generated zod agrees with the raw staging schemas on every shared fixture', () => {
  const ajv = new Ajv2020({ strict: true, allowUnionTypes: true });
  for (const kind of ['download', 'cot'] as const) {
    const schema = JSON.parse(readFileSync(new URL(`../schemas/${kind}-job-manifest.v2.schema.json`, import.meta.url), 'utf8')) as object;
    const validate = ajv.compile(schema);
    const name = `heisentick/${kind}-job-manifest` as const;
    for (const c of [...fixture.cases, ...fixture.states, ...fixture.invalidManifests]) {
      if (c.manifest.schema !== name) continue;
      assert.equal(DOCUMENT_SCHEMAS[name].safeParse(c.manifest).success, Boolean(validate(c.manifest)), c.name);
    }
  }
});
