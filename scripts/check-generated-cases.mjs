import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildGeneratedFixture } from './generated-cases.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURE_PATH = join(ROOT, 'fixtures', 'canonical', 'generated-cases.json');
const expected = JSON.parse(JSON.stringify(buildGeneratedFixture()));
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
