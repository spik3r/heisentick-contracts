import { z } from 'zod';
export declare const candleSnapshotManifestV1: z.ZodObject<{
    schema: z.ZodLiteral<"heisentick/candle-snapshot-manifest">;
    version: z.ZodLiteral<1>;
    symbol: z.ZodString;
    timeframe: z.ZodEnum<{
        "1m": "1m";
        "5m": "5m";
        "15m": "15m";
        "30m": "30m";
        "1h": "1h";
        "4h": "4h";
        "1d": "1d";
    }>;
    object: z.ZodString;
    sha256: z.ZodString;
    byteLength: z.ZodNumber;
    count: z.ZodNumber;
    firstT: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
    lastT: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
    layout: z.ZodObject<{
        schema: z.ZodLiteral<"heisentick/bar-binary-layout">;
        version: z.ZodLiteral<1>;
        colCount: z.ZodNumber;
    }, z.core.$strict>;
    publishedAt: z.ZodNumber;
    producer: z.ZodObject<{
        service: z.ZodLiteral<"heisentick-api">;
        release: z.ZodString;
        commitId: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    supersedes: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
}, z.core.$strict>;
export type CandleSnapshotManifestV1 = z.infer<typeof candleSnapshotManifestV1>;
