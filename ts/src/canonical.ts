// Canonical JSON and the input fingerprint.
//
// The rules are fixed by docs/canonical-json.md and mirrored in
// go/canonical.go; fixtures/canonical/ holds cases both must agree on.
//   - objects: keys sorted by UTF-16 code unit order, no whitespace
//   - arrays: in order
//   - strings: JSON.stringify escaping (", \, control characters as \n \r \t
//     \b \f or \u00xx lower-case; nothing else escaped)
//   - numbers: ECMAScript Number::toString (shortest round-trip; decimal
//     notation for 1e-6 <= |x| < 1e21, otherwise exponent with e+ / e- and no
//     zero padding); -0 becomes 0; NaN and Infinity are rejected
//   - true, false, null literally; undefined values are rejected, not dropped,
//     so a caller cannot accidentally hash an object with a missing field
import { createHash } from 'node:crypto';

export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export class CanonicalJsonError extends Error {
  constructor(message: string, readonly path: string) {
    super(`${message} at ${path || '$'}`);
    this.name = 'CanonicalJsonError';
  }
}

function canonicalNumber(value: number, path: string): string {
  if (!Number.isFinite(value)) throw new CanonicalJsonError('non-finite number', path);
  if (Object.is(value, -0)) return '0';
  return String(value);
}

function canonicalString(value: string): string {
  return JSON.stringify(value);
}

function write(value: unknown, path: string, out: string[]): void {
  if (value === null) { out.push('null'); return; }
  switch (typeof value) {
    case 'boolean': out.push(value ? 'true' : 'false'); return;
    case 'number': out.push(canonicalNumber(value, path)); return;
    case 'string': out.push(canonicalString(value)); return;
    case 'undefined': throw new CanonicalJsonError('undefined value', path);
    case 'object': break;
    default: throw new CanonicalJsonError(`unsupported type ${typeof value}`, path);
  }
  if (Array.isArray(value)) {
    out.push('[');
    value.forEach((item, index) => {
      if (index) out.push(',');
      write(item, `${path}[${index}]`, out);
    });
    out.push(']');
    return;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  out.push('{');
  keys.forEach((key, index) => {
    if (index) out.push(',');
    out.push(canonicalString(key), ':');
    write(record[key], `${path}.${key}`, out);
  });
  out.push('}');
}

export function canonicalJson(value: unknown): string {
  const out: string[] = [];
  write(value, '', out);
  return out.join('');
}

export function sha256Hex(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

// Fields of a validation-run-manifest that identify the submission rather
// than the inputs. They are removed before hashing so a deliberate re-run of
// identical inputs produces the same fingerprint under a new runId.
export const MANIFEST_IDENTITY_FIELDS = ['runId', 'requestKey', 'requestedBy', 'submittedAt', 'inputFingerprint'] as const;

export function inputFingerprint(manifest: Record<string, unknown>): string {
  const inputs: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(manifest)) {
    if (!(MANIFEST_IDENTITY_FIELDS as readonly string[]).includes(key)) inputs[key] = value;
  }
  return sha256Hex(canonicalJson(inputs));
}
