// Independent Node oracle for the exact byte vectors consumed by the Go
// primitive's tests. This file is test-only, not a TypeScript validation API.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

type ErrorCode = 'invalid-limit' | 'invalid-byte-length' | 'invalid-sha256'
  | 'limit-exceeded' | 'byte-length-mismatch' | 'sha256-mismatch';
type ByteCase = {
  name: string;
  bodyHex: string;
  byteLength: number;
  sha256: string;
  maxBytes: number;
  wantError: ErrorCode | null;
};

const fixture = JSON.parse(readFileSync(new URL('./fixtures/staging-byte-integrity.json', import.meta.url), 'utf8')) as {
  formatVersion: number;
  cases: ByteCase[];
};
const errorCodes: ErrorCode[] = [
  'invalid-limit', 'invalid-byte-length', 'invalid-sha256',
  'limit-exceeded', 'byte-length-mismatch', 'sha256-mismatch',
];

// No production implementation is imported: Node measures Buffer bytes and
// computes SHA-256 independently of Go. Match the documented error precedence.
function oracle(vector: ByteCase, bytes: Buffer): ErrorCode | null {
  if (!Number.isSafeInteger(vector.maxBytes) || vector.maxBytes < 0) return 'invalid-limit';
  if (!Number.isSafeInteger(vector.byteLength) || vector.byteLength < 0) return 'invalid-byte-length';
  if (vector.sha256.length !== 64 || /[^0-9a-f]/.test(vector.sha256)) return 'invalid-sha256';
  if (Math.max(vector.byteLength, bytes.byteLength) > vector.maxBytes) return 'limit-exceeded';
  if (bytes.byteLength !== vector.byteLength) return 'byte-length-mismatch';
  return createHash('sha256').update(bytes).digest('hex') === vector.sha256 ? null : 'sha256-mismatch';
}

test('staging byte corpus is nonempty, explicit, and covers every outcome', () => {
  assert.deepEqual(Object.keys(fixture).sort(), ['cases', 'formatVersion']);
  assert.equal(fixture.formatVersion, 1);
  assert.ok(Array.isArray(fixture.cases) && fixture.cases.length > 0);
  const names = new Set<string>();
  for (const vector of fixture.cases) {
    assert.deepEqual(Object.keys(vector).sort(), ['bodyHex', 'byteLength', 'maxBytes', 'name', 'sha256', 'wantError']);
    assert.equal(typeof vector.name, 'string');
    assert.ok(vector.name && !names.has(vector.name), 'nonempty unique vector name');
    names.add(vector.name);
    assert.equal(typeof vector.bodyHex, 'string');
    assert.match(vector.bodyHex, /^(?:[0-9a-f]{2})*$/);
    assert.equal(typeof vector.sha256, 'string');
    assert.equal(typeof vector.byteLength, 'number');
    assert.equal(typeof vector.maxBytes, 'number');
    assert.ok(vector.wantError === null || errorCodes.includes(vector.wantError));
  }
  for (const code of [null, ...errorCodes]) {
    assert.ok(fixture.cases.some((vector) => vector.wantError === code), `missing outcome ${code}`);
  }
});

for (const vector of fixture.cases) {
  test(`staging byte oracle: ${vector.name}`, () => {
    const bytes = Buffer.from(vector.bodyHex, 'hex');
    assert.equal(oracle(vector, bytes), vector.wantError);
  });
}

function named(name: string): ByteCase {
  const vector = fixture.cases.find((entry) => entry.name === name);
  assert.ok(vector, `missing vector ${name}`);
  return vector;
}

test('published SHA-256 test vectors anchor empty and abc byte identities', () => {
  assert.equal(named('empty').bodyHex, '');
  assert.equal(named('empty').sha256, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  assert.equal(named('abc').bodyHex, '616263');
  assert.equal(named('abc').sha256, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});

test('transport identity changes for equivalent JSON with different exact bytes', () => {
  for (const [firstName, secondName] of [
    ['compact-json', 'whitespace-json'], ['multibyte-json', 'escaped-unicode-json'],
  ]) {
    const first = named(firstName);
    const second = named(secondName);
    assert.deepEqual(JSON.parse(Buffer.from(first.bodyHex, 'hex').toString('utf8')),
      JSON.parse(Buffer.from(second.bodyHex, 'hex').toString('utf8')));
    assert.notEqual(first.bodyHex, second.bodyHex);
    assert.notEqual(first.sha256, second.sha256);
    assert.equal(first.wantError, null);
    assert.equal(second.wantError, null);
  }
  const unicode = named('multibyte-json');
  const bytes = Buffer.from(unicode.bodyHex, 'hex');
  assert.ok(bytes.byteLength > bytes.toString('utf8').length, 'count UTF-8 bytes, not JS characters');
});
