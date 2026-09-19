#!/usr/bin/env node
// Writes the committed fixtures under fixtures/. Run once when adding a
// document; the outputs are committed and reviewed like source. Invalid
// fixtures are derived from the valid one by a single named mutation, so a
// reviewer can see exactly which rule each one exercises.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'fixtures');

const SHA = 'a'.repeat(64);
const SHA2 = 'b'.repeat(64);
const UUID = '0f3c1d2e-4a5b-4c6d-8e9f-0a1b2c3d4e5f';
const UUID2 = '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d';
const T0 = 1600000000000;

const valid = {
  'bar-binary-layout.v1': {
    schema: 'heisentick/bar-binary-layout', version: 1, magic: 0x31425442, layoutVersion: 1,
    count: 3, colCount: 6, columns: ['t', 'o', 'h', 'l', 'c', 'v'], byteLength: 16 + 6 * 3 * 8,
    endianness: 'little', headerBytes: 16, valueBytes: 8,
  },
  'candle-snapshot-manifest.v1': {
    schema: 'heisentick/candle-snapshot-manifest', version: 1, symbol: 'XAUUSD', timeframe: '1m',
    object: `candles/XAUUSD/1m/${SHA}.bin`, sha256: SHA, byteLength: 16 + 6 * 2 * 8, count: 2,
    firstT: T0, lastT: T0 + 60_000,
    layout: { schema: 'heisentick/bar-binary-layout', version: 1, colCount: 6 },
    publishedAt: T0 + 120_000, producer: { service: 'heisentick-api', release: 'v1.0.15' }, supersedes: null,
  },
  'validation-run-request.v1': {
    schema: 'heisentick/validation-run-request', version: 1, requestKey: UUID, kind: 'validate',
    strategyId: 'ict2tfFvgXauusd1h5m', route: { symbol: 'XAUUSD', timeframe: '5m', rangeMethod: 'zone' },
    costMode: 'realistic', window: { from: '2020-01-01', to: '2026-09-01' }, monteCarloIterations: 5000,
  },
  'validation-run-manifest.v1': {
    schema: 'heisentick/validation-run-manifest', version: 1, runId: UUID, requestKey: UUID2,
    inputFingerprint: SHA2, kind: 'validate',
    strategy: { id: 'ict2tfFvgXauusd1h5m', sourceSha256: SHA, params: { fib: 0.618, sweepFirst: true } },
    engine: { stratRelease: 'v0.2.0', stratBuildDigest: SHA, goVersion: 'go1.27.0', validationRelease: 'v0.1.0', reportSchemaVersion: 1, resultSchemaVersion: 1 },
    route: { symbol: 'XAUUSD', timeframe: '5m', sourceTimeframe: '1h', higherTimeframe: '4h', rangeMethod: 'zone', instrument: { tickSize: 0.01, pointValue: 1, quoteCurrency: 'USD' } },
    data: {
      provider: 'dukascopy',
      series: [
        { role: 'entry', symbol: 'XAUUSD', timeframe: '5m', object: `candles/XAUUSD/5m/${SHA}.bin`, sha256: SHA, count: 405000, windowFromT: T0 - 86_400_000, windowToT: T0 + 86_400_000 },
        { role: 'source', symbol: 'XAUUSD', timeframe: '1h', object: `candles/XAUUSD/1h/${SHA2}.bin`, sha256: SHA2, count: 33000, windowFromT: T0 - 86_400_000, windowToT: T0 + 86_400_000 },
      ],
    },
    execution: { fromT: T0, toT: T0 + 86_400_000, warmupBars: 288, fillOn: 'close', initialState: 'flat', endOfTest: 'liquidate-last-close', holdoutFromT: null },
    costs: { modelVersion: 1, mode: 'realistic', slippage: 0.06, slippageBps: 0, spread: 0, commissionPerUnit: 0, financingPerDayBps: 0, startEquity: 10000 },
    validation: {
      grid: { cells: [{ cellIndex: 0, params: { fib: 0.5 }, costMode: 'realistic' }, { cellIndex: 1, params: { fib: 0.618 }, costMode: 'harsh' }] },
      monteCarlo: { methods: ['permutation', 'bootstrap'], iterations: 5000, seed: 12345 },
      diagnostics: { recentMonths: 30, harshCostMode: 'harsh' },
    },
    policy: { promotionPolicyVersion: 1, profile: 'ict2tfFvgXauusd1h5m|XAUUSD 5m|validate|realistic|full|p1' },
    requestedBy: { subject: 'kp_0123456789abcdef', via: 'lab-ui' },
    submittedAt: T0 + 3_600_000,
  },
  'validation-run-result.v1': {
    schema: 'heisentick/validation-run-result', version: 1, runId: UUID, attempt: 1, inputFingerprint: SHA2,
    manifestKey: `runs/${UUID}/manifest.json`,
    execution: { status: 'succeeded', stages: [
      { stage: 'report', status: 'succeeded', durationMs: 229000, billedMs: 229000, maxMemoryMb: 2200 },
      { stage: 'grid', status: 'succeeded', durationMs: 60000, cells: 2 },
      { stage: 'montecarlo', status: 'succeeded', durationMs: 4000 },
      { stage: 'diagnostics', status: 'succeeded', durationMs: 90000 },
      { stage: 'assemble', status: 'succeeded', durationMs: 500 },
    ] },
    assessment: { status: 'assessed', minimumTrades: 100 },
    promotion: { status: 'not-eligible', policyVersion: 1, checks: [
      { name: 'profitFactor', passed: false, value: 1.04, threshold: 1.2, comparator: 'at-least' },
      { name: 'trades', passed: true, value: 553, threshold: 100, comparator: 'at-least' },
    ] },
    headline: {
      trades: 553, winRate: 0.41, profitFactor: 1.04, net: 812.5, expectancy: 1.47, maxDrawdown: 14.5, maxDrawdownUnit: 'percent-of-peak-equity',
      firstTradeT: T0 + 7_200_000, lastTradeT: T0 + 80_000_000,
      monteCarlo: { method: 'permutation', iterations: 5000, drawdownP5: 900, drawdownP50: 1500, drawdownP95: 2600 },
    },
    artifacts: {
      report: { object: `runs/${UUID}/1/report.json`, sha256: SHA, byteLength: 120000, schema: 'heisentick/go-report', version: 1 },
      trades: { object: `runs/${UUID}/1/trades.json`, sha256: SHA2, byteLength: 400000, schema: 'heisentick/trade-list', version: 1 },
    },
    engine: { stratRelease: 'v0.2.0', stratBuildDigest: SHA, validationRelease: 'v0.1.0' },
    finishedAt: T0 + 90_000_000,
  },
  'validation-run-result-failed.v1': {
    schema: 'heisentick/validation-run-result', version: 1, runId: UUID, attempt: 2, inputFingerprint: SHA2,
    manifestKey: `runs/${UUID}/manifest.json`,
    execution: { status: 'failed', failedStage: 'report', error: { code: 'engine-panic', message: 'index out of range' }, stages: [
      { stage: 'report', status: 'failed', durationMs: 1200 },
      { stage: 'grid', status: 'skipped', durationMs: 0 },
      { stage: 'montecarlo', status: 'skipped', durationMs: 0 },
      { stage: 'diagnostics', status: 'skipped', durationMs: 0 },
      { stage: 'assemble', status: 'succeeded', durationMs: 300 },
    ] },
    assessment: { status: 'unassessed' },
    promotion: { status: 'unassessed', policyVersion: 1 },
    headline: null,
    artifacts: {},
    engine: { stratRelease: 'v0.2.0', stratBuildDigest: SHA, validationRelease: 'v0.1.0' },
    finishedAt: T0 + 90_000_000,
  },
  'validation-request-message.v1': {
    schema: 'heisentick/validation-request-message', version: 1, runId: UUID, attempt: 1,
    manifestKey: `runs/${UUID}/manifest.json`, manifestSha256: SHA, inputFingerprint: SHA2, submittedAt: T0,
  },
  'validation-result-message.v1': {
    schema: 'heisentick/validation-result-message', version: 1, runId: UUID, attempt: 1, status: 'succeeded',
    envelopeKey: `runs/${UUID}/1/envelope.json`, envelopeSha256: SHA, executionArn: `arn:aws:states:ap-southeast-2:123456789012:execution:StrategyValidation:${UUID}-1`, finishedAt: T0 + 90_000_000,
  },
};

const clone = (v) => JSON.parse(JSON.stringify(v));

// name → mutation. Every invalid case is one rule.
const invalid = {
  'bar-binary-layout.v1': {
    'unknown-field': (d) => { d.extra = 1; },
    'wrong-magic': (d) => { d.magic = 1; },
    'too-few-columns': (d) => { d.colCount = 4; },
    'missing-count': (d) => { delete d.count; },
  },
  'candle-snapshot-manifest.v1': {
    'unknown-field': (d) => { d.checksum = SHA; },
    'wrong-schema-version': (d) => { d.version = 2; },
    'sha-upper-case': (d) => { d.sha256 = SHA.toUpperCase(); },
    'bad-timeframe': (d) => { d.timeframe = '2h'; },
    'leading-slash-key': (d) => { d.object = `/candles/XAUUSD/1m/${SHA}.bin`; },
    'string-timestamp': (d) => { d.firstT = '2020-09-13T12:26:40Z'; },
    'branch-release': (d) => { d.producer.release = 'main'; },
  },
  'validation-run-request.v1': {
    'unknown-field': (d) => { d.engine = 'js'; },
    'missing-request-key': (d) => { delete d.requestKey; },
    'iterations-too-many': (d) => { d.monteCarloIterations = 50000; },
    'bad-date': (d) => { d.window.from = '2020/01/01'; },
    'bad-cost-mode': (d) => { d.costMode = 'zero'; },
  },
  'validation-run-manifest.v1': {
    'unknown-field': (d) => { d.latest = true; },
    'missing-fingerprint': (d) => { delete d.inputFingerprint; },
    'empty-series': (d) => { d.data.series = []; },
    'grid-too-large': (d) => { d.validation.grid.cells = Array.from({ length: 65 }, (_, i) => ({ cellIndex: i, params: {}, costMode: 'raw' })); },
    'nan-slippage': (d) => { d.costs.slippage = 'NaN'; },
    'float-timestamp': (d) => { d.execution.fromT = T0 + 0.5; },
    'null-required-object': (d) => { d.validation = null; },
    'email-as-subject': (d) => { d.requestedBy.subject = ''; },
  },
  'validation-run-result-failed.v1': {
    'succeeded-without-report': (d) => { d.execution.status = 'succeeded'; d.headline = { trades: 0, winRate: null, profitFactor: null, net: 0, expectancy: null, maxDrawdown: 0, firstTradeT: null, lastTradeT: null }; },
    'succeeded-with-null-headline': (d) => { d.execution.status = 'succeeded'; d.artifacts = { report: { object: 'runs/x/1/report.json', sha256: SHA, byteLength: 1, schema: 'heisentick/go-report', version: 1 } }; },
    'unknown-field': (d) => { d.retry = true; },
  },
  'validation-run-result.v1': {
    'missing-comparator': (d) => { delete d.promotion.checks[0].comparator; },
    'unknown-field': (d) => { d.pf = 1; },
    'headline-missing': (d) => { delete d.headline; },
    'bad-stage': (d) => { d.execution.stages[0].stage = 'backtest'; },
    'negative-drawdown': (d) => { d.headline.maxDrawdown = -1; },
    'artifact-too-large': (d) => { d.artifacts.report.byteLength = 60 * 1024 * 1024; },
    'attempt-zero': (d) => { d.attempt = 0; },
    'symbolic-comparator': (d) => { d.promotion.checks[0].comparator = '>='; },
    'bad-drawdown-unit': (d) => { d.headline.maxDrawdownUnit = 'points'; },
  },
  'validation-request-message.v1': {
    'unknown-field': (d) => { d.manifest = {}; },
    'attempt-zero': (d) => { d.attempt = 0; },
    'wrong-schema-name': (d) => { d.schema = 'heisentick/validation-result-message'; },
  },
  'validation-result-message.v1': {
    'unknown-field': (d) => { d.headline = {}; },
    'bad-status': (d) => { d.status = 'done'; },
    'missing-envelope': (d) => { delete d.envelopeKey; },
  },
};

// Canonical JSON cases: hand-written input → expected canonical text. The
// sha256 column is filled by the TypeScript implementation and checked by Go.
const canonical = [
  { name: 'key-order', input: { b: 1, a: 2, 'B': 3, '_': 4 }, canonical: '{"B":3,"_":4,"a":2,"b":1}' },
  { name: 'nested', input: { z: [{ y: null, x: [true, false] }], a: {} }, canonical: '{"a":{},"z":[{"x":[true,false],"y":null}]}' },
  { name: 'numbers', input: { a: 1, b: 1.5, c: -0, d: 1e21, e: 1e-7, f: 0.1, g: 123456789012345680000, h: 5e-324, i: 0.000001, j: 1.7976931348623157e308 }, canonical: '{"a":1,"b":1.5,"c":0,"d":1e+21,"e":1e-7,"f":0.1,"g":123456789012345680000,"h":5e-324,"i":0.000001,"j":1.7976931348623157e+308}' },
  { name: 'strings', input: { s: 'a"b\\c\n\té😀/<>&\u2028' }, canonical: '{"s":"a\\"b\\\\c\\n\\t\\u0001é😀/<>&\u2028"}' },
  { name: 'unicode-keys', input: { 'é': 1, 'e': 2, '😀': 3, 'Z': 4 }, canonical: '{"Z":4,"e":2,"é":1,"😀":3}' },
  { name: 'empty', input: {}, canonical: '{}' },
];

rmSync(OUT, { recursive: true, force: true });
for (const [doc, value] of Object.entries(valid)) {
  mkdirSync(join(OUT, doc, 'valid'), { recursive: true });
  mkdirSync(join(OUT, doc, 'invalid'), { recursive: true });
  writeFileSync(join(OUT, doc, 'valid', 'example.json'), `${JSON.stringify(value, null, 2)}\n`);
  for (const [name, mutate] of Object.entries(invalid[doc])) {
    const copy = clone(value);
    mutate(copy);
    writeFileSync(join(OUT, doc, 'invalid', `${name}.json`), `${JSON.stringify(copy, null, 2)}\n`);
  }
}
mkdirSync(join(OUT, 'canonical'), { recursive: true });
writeFileSync(join(OUT, 'canonical', 'cases.json'), `${JSON.stringify(canonical, null, 2)}\n`);
console.log(`wrote fixtures for ${Object.keys(valid).length} documents and ${canonical.length} canonical cases`);
