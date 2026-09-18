import * as gen from './gen/index.js';
export * from './gen/index.js';
export { canonicalJson, inputFingerprint, sha256Hex, CanonicalJsonError, MANIFEST_IDENTITY_FIELDS } from './canonical.js';
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
};
export class ContractError extends Error {
    schema;
    issues;
    constructor(message, schema, issues = []) {
        super(message);
        this.schema = schema;
        this.issues = issues;
        this.name = 'ContractError';
    }
}
function schemaNameOf(value) {
    if (value && typeof value === 'object' && typeof value.schema === 'string') {
        return value.schema;
    }
    return null;
}
export function parseDocument(name, value) {
    const schema = DOCUMENT_SCHEMAS[name];
    const result = schema.safeParse(value);
    if (!result.success) {
        const issues = result.error.issues.map((issue) => `${issue.path.map(String).join('.') || '$'}: ${issue.message}`);
        throw new ContractError(`${name} rejected: ${issues[0]}${issues.length > 1 ? ` (+${issues.length - 1} more)` : ''}`, name, issues);
    }
    return result.data;
}
export function parseAnyDocument(value) {
    const declared = schemaNameOf(value);
    if (!declared || !(declared in DOCUMENT_SCHEMAS)) {
        throw new ContractError(`unknown document schema ${declared === null ? '(missing schema field)' : JSON.stringify(declared)}`, declared);
    }
    const name = declared;
    return { schema: name, document: parseDocument(name, value) };
}
