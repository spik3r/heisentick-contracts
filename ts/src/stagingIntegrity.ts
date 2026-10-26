import { createHash } from 'node:crypto';

export interface StagedPayload {
  key: string;
  byteLength: number;
  sha256: string;
}

// Production verifier. This checks already-bounded bytes, not a transport.
// The caller must still bind the manifest to its request and validate rows.
export function verifyStagedBytes(bytes: Uint8Array, payload: StagedPayload, maxBytes: number): void {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) throw new Error('staged bytes: invalid-limit');
  if (!Number.isSafeInteger(payload?.byteLength) || payload.byteLength < 0) throw new Error('staged bytes: invalid-byte-length');
  if (!/^[a-f0-9]{64}$/.test(payload.sha256)) throw new Error('staged bytes: invalid-sha256');
  if (payload.byteLength > maxBytes || bytes.byteLength > maxBytes) throw new Error('staged bytes: limit-exceeded');
  if (bytes.byteLength !== payload.byteLength) throw new Error('staged bytes: byte-length-mismatch');
  if (createHash('sha256').update(bytes).digest('hex') !== payload.sha256) throw new Error('staged bytes: sha256-mismatch');
}

interface Manifest {
  schema: string;
  requested: { from: string | null; to: string | null };
  jobId: string;
  symbol?: string;
  timeframe?: string;
  datasetId?: string;
  files: string[];
  payload: StagedPayload | null;
  count: number;
  from: string | null;
  to: string | null;
  complete: boolean;
  error: unknown;
  resumeFrom?: string | null;
}

// Called after structural schema validation. Request identity and actual row
// bounds must also be checked by the consumer against its own request/rows.
export function stagingManifestIssues(value: unknown): string[] {
  const d = value as Manifest;
  const fail = (message: string) => [message];
  if (d.files.length === 0) {
    if (d.payload !== null || d.count !== 0 || d.from !== null || d.to !== null || d.complete || !d.error || d.resumeFrom) return fail('terminal staging manifest must revoke payload metadata');
    return [];
  }
  const key = d.schema === 'heisentick/download-job-manifest'
    ? `staging/${d.jobId}/${d.symbol}/${d.timeframe}.json`
    : `staging/${d.jobId}/cot/${d.datasetId}.json`;
  if (d.files[0] !== key || d.payload?.key !== key) return fail('payload key must equal the exact job route key');
  if (d.count === 0 ? (d.from !== null || d.to !== null) : (d.from === null || d.to === null || d.from > d.to)) return fail('count and actual bounds disagree');
  if (d.complete && (d.error !== null || d.resumeFrom)) return fail('complete staging manifest cannot carry error or resume state');
  if (!d.complete && (d.schema === 'heisentick/cot-job-manifest' || !d.resumeFrom)) return fail('incomplete staging payload requires candle resume state');
  if (!d.complete && d.resumeFrom) {
    const resume = Date.parse(d.resumeFrom);
    const from = Date.parse(d.requested.from ?? '');
    const to = Date.parse(d.requested.to ?? '');
    if (![resume, from, to].every(Number.isFinite) || resume < from || resume > to) return fail('resume point must remain within requested bounds');
  }
  return [];
}
