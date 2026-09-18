export type JsonValue = null | boolean | number | string | JsonValue[] | {
    [key: string]: JsonValue;
};
export declare class CanonicalJsonError extends Error {
    readonly path: string;
    constructor(message: string, path: string);
}
export declare function canonicalJson(value: unknown): string;
export declare function sha256Hex(text: string): string;
export declare const MANIFEST_IDENTITY_FIELDS: readonly ["runId", "requestKey", "requestedBy", "submittedAt", "inputFingerprint"];
export declare function inputFingerprint(manifest: Record<string, unknown>): string;
