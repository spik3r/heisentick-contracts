#!/usr/bin/env node
// Fills the sha256 column of fixtures/canonical/cases.json and writes the
// manifest fixture's fingerprint. The TypeScript implementation writes these;
// go test reads them back, so the two languages are checked against each
// other on every CI run.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalJson, inputFingerprint, sha256Hex } from '../dist/index.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const casesPath = join(ROOT, 'fixtures', 'canonical', 'cases.json');
const cases = JSON.parse(readFileSync(casesPath, 'utf8'));
for (const c of cases) {
  const canonical = canonicalJson(c.input);
  if (canonical !== c.canonical) throw new Error(`${c.name}: implementation disagrees with the hand-written canonical text`);
  c.sha256 = sha256Hex(canonical);
}
writeFileSync(casesPath, `${JSON.stringify(cases, null, 2)}\n`);

const generatedCasesPath = join(ROOT, 'fixtures', 'canonical', 'generated-cases.json');
const generated = JSON.parse(readFileSync(generatedCasesPath, 'utf8'));
for (const c of generated.cases) {
  const canonical = canonicalJson(c.input);
  c.sha256 = sha256Hex(canonical);
}
for (const c of generated.fingerprints) {
  c.fingerprint = inputFingerprint(c.manifest);
  c.materialFingerprint = inputFingerprint({
    ...c.manifest,
    costs: { ...c.manifest.costs, ...c.materialVariant.costs },
  });
}
writeFileSync(generatedCasesPath, JSON.stringify(generated, null, 2) + '\n');

const manifest = JSON.parse(readFileSync(join(ROOT, 'fixtures', 'validation-run-manifest.v1', 'valid', 'example.json'), 'utf8'));
writeFileSync(join(ROOT, 'fixtures', 'validation-run-manifest.v1', 'fingerprint.txt'), `${inputFingerprint(manifest)}\n`);
console.log(`sealed ${cases.length} canonical cases and the manifest fingerprint`);
