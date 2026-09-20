import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { canonicalJson, inputFingerprint, sha256Hex } from '../dist/canonical.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURE_PATH = join(ROOT, 'fixtures', 'canonical', 'generated-cases.json');
const SEEDS = [0x1a2b3c4d, 0xdeadbeef, 0x0badc0de, 0x2468ace0];
const BOUNDARIES = [
  -0,
  Number.MIN_VALUE,
  -Number.MIN_VALUE,
  1e-7,
  -1e-7,
  1e-6,
  -1e-6,
  1e20,
  -1e20,
  1e21,
  -1e21,
  Number.MAX_VALUE,
  -Number.MAX_VALUE,
  9007199254740991,
  9007199254740992,
];

function next(state) {
  return Math.imul(state, 1664525) + 1013904223 >>> 0;
}

function makeInput(seed) {
  let state = seed >>> 0;
  const take = () => {
    state = next(state);
    return state;
  };
  const number = () => BOUNDARIES[take() % BOUNDARIES.length];
  const text = `seed-${seed.toString(16)}-${take() % 100000} 😀 ${String.fromCodePoint(0x1f600 + take() % 16)}\u2028`;
  const key = `key-${take().toString(16).padStart(8, '0')}`;
  return {
    z: { [key]: number(), '😀': number(), '\uE000': number() },
    a: [true, false, null, text, { b: number(), a: number() }],
    text,
    boundaries: BOUNDARIES,
    zero: -0,
    nested: [{ '😀': number(), '\uE000': number() }, [number(), number()]],
  };
}

function seedText(seed) {
  return `0x${seed.toString(16).padStart(8, '0')}`;
}

function buildFixture() {
  const cases = SEEDS.map((seed, index) => {
    const input = makeInput(seed);
    const canonical = canonicalJson(input);
    return {
      name: `generated-${String(index + 1).padStart(2, '0')}`,
      seed: seedText(seed),
      input,
      canonical,
      sha256: sha256Hex(canonical),
    };
  });
  const fingerprints = SEEDS.map((seed, index) => {
    const manifest = {
      schema: 'heisentick/validation-run-manifest',
      version: 1,
      seed: seedText(seed),
      instrument: 'XAUUSD',
      numbers: BOUNDARIES,
      nested: makeInput(seed).nested,
      costs: { slippage: index % 2 ? -1e-7 : 1e-7 },
      runId: `run-${index}`,
      requestKey: `request-${index}`,
      requestedBy: { subject: `subject-${index}`, via: 'generated' },
      submittedAt: index + 1,
      inputFingerprint: 'placeholder',
    };
    const identityVariant = {
      runId: `rerun-${index}`,
      requestKey: `retry-${index}`,
      requestedBy: { subject: `other-${index}`, via: 'api' },
      submittedAt: 999,
      inputFingerprint: 'different',
    };
    const materialVariant = { costs: { slippage: index % 2 ? -0.1 : 0.1 } };
    const materialManifest = {
      ...manifest,
      costs: { ...manifest.costs, ...materialVariant.costs },
    };
    return {
      name: `fingerprint-${String(index + 1).padStart(2, '0')}`,
      seed: seedText(seed),
      manifest,
      identityVariant,
      materialVariant,
      fingerprint: inputFingerprint(manifest),
      materialFingerprint: inputFingerprint(materialManifest),
    };
  });
  return { algorithm: 'lcg32-v1', boundedCaseCount: cases.length, cases, fingerprints };
}

const expected = JSON.parse(JSON.stringify(buildFixture()));
if (process.argv[2] === '--write') {
  writeFileSync(FIXTURE_PATH, JSON.stringify(expected, null, 2) + '\n');
  console.log('wrote ' + expected.cases.length + ' canonical and ' + expected.fingerprints.length + ' fingerprint vectors');
} else {
  const actual = JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'));
  assert.ok(actual.cases.length > 0, 'generated fixture has no canonical cases');
  assert.ok(actual.fingerprints.length > 0, 'generated fixture has no fingerprint cases');
  assert.deepEqual(actual, expected, 'generated fixture drifted; run node scripts/check-generated-cases.mjs --write');
  console.log('checked ' + actual.cases.length + ' canonical and ' + actual.fingerprints.length + ' fingerprint vectors');
}
