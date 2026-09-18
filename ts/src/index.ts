// @heisentick/contracts — zod schemas generated from schemas/*.schema.json,
// plus the canonical JSON / fingerprint helpers every producer and consumer
// shares. Consumers pin a release tag; nothing here is hand-written twice.
import type { ZodType } from 'zod';
import * as gen from './gen/index.js';

export * from './gen/index.js';
export { canonicalJson, inputFingerprint, sha256Hex, CanonicalJsonError, MANIFEST_IDENTITY_FIELDS } from './canonical.js';
export type { JsonValue } from './canonical.js';

// Document schemas by the `schema` field value each document carries, so a
// boundary can dispatch on the wire without knowing the TypeScript name.
export const DOCUMENT_SCHEMAS = {
  'heisentick/bar-binary-layout': gen.barBinaryLayoutV1,
  'heisentick/candle-snapshot-manifest': gen.candleSnapshotManifestV1,
  'heisentick/validation-run-manifest': gen.validationRunManifestV1,
  'heisentick/validation-run-request': gen.validationRunRequestV1,
  'heisentick/validation-run-result': gen.validationRunResultV1,
  'heisentick/validation-request-message': gen.validationQueueMessagesV1ValidationRequestMessage,
  'heisentick/validation-result-message': gen.validationQueueMessagesV1ValidationResultMessage,
} as const satisfies Record<string, ZodType>;

export type DocumentSchemaName = keyof typeof DOCUMENT_SCHEMAS;

export class ContractError extends Error {
  constructor(message: string, readonly schema: string | null, readonly issues: readonly string[] = []) {
    super(message);
    this.name = 'ContractError';
  }
}

function schemaNameOf(value: unknown): string | null {
  if (value && typeof value === 'object' && typeof (value as { schema?: unknown }).schema === 'string') {
    return (value as { schema: string }).schema;
  }
  return null;
}

// Parse an untrusted document (queue body, artifact, request body) by the
// schema name it declares. An unknown schema name or version is a
// ContractError, not a silent pass: the caller decides whether to dead-letter.
export function parseDocument<N extends DocumentSchemaName>(name: N, value: unknown): ReturnType<(typeof DOCUMENT_SCHEMAS)[N]['parse']>;
export function parseDocument(name: DocumentSchemaName, value: unknown): unknown {
  const schema = DOCUMENT_SCHEMAS[name];
  const result = schema.safeParse(value);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `${issue.path.map(String).join('.') || '$'}: ${issue.message}`);
    throw new ContractError(`${name} rejected: ${issues[0]}${issues.length > 1 ? ` (+${issues.length - 1} more)` : ''}`, name, issues);
  }
  const crossField = crossFieldIssues(name, result.data);
  if (crossField.length) throw new ContractError(`${name} rejected: ${crossField[0]}`, name, crossField);
  return result.data;
}

// Rules that span fields. Mirrored in contracts.go (crossFieldIssues); a
// root-level JSON Schema conditional cannot express them without losing the
// generated zod object's rejection of unknown fields.
export function crossFieldIssues(name: DocumentSchemaName, doc: unknown): string[] {
  const issues: string[] = [];
  if (name === 'heisentick/validation-run-result') {
    const d = doc as { execution: { status: string }; artifacts: { report?: unknown }; headline: unknown };
    if (d.execution.status === 'succeeded') {
      if (!d.artifacts.report) issues.push('artifacts.report: required when execution.status is succeeded');
      if (d.headline === null) issues.push('headline: must not be null when execution.status is succeeded');
    }
  }
  return issues;
}

export function parseAnyDocument(value: unknown): { schema: DocumentSchemaName; document: unknown } {
  const declared = schemaNameOf(value);
  if (!declared || !(declared in DOCUMENT_SCHEMAS)) {
    throw new ContractError(`unknown document schema ${declared === null ? '(missing schema field)' : JSON.stringify(declared)}`, declared);
  }
  const name = declared as DocumentSchemaName;
  return { schema: name, document: parseDocument(name, value) };
}
