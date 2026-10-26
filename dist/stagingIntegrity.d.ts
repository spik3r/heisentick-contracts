export interface StagedPayload {
    key: string;
    byteLength: number;
    sha256: string;
}
export declare function verifyStagedBytes(bytes: Uint8Array, payload: StagedPayload, maxBytes: number): void;
export declare function stagingManifestIssues(value: unknown): string[];
