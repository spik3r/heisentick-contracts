import { z } from 'zod';
export declare const downloadJobManifestV2: z.ZodObject<{
    schema: z.ZodLiteral<"heisentick/download-job-manifest">;
    version: z.ZodLiteral<2>;
    jobId: z.ZodString;
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
    source: z.ZodLiteral<"dukascopy">;
    requested: z.ZodObject<{
        from: z.ZodString;
        to: z.ZodString;
    }, z.core.$strict>;
    from: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    to: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    count: z.ZodNumber;
    complete: z.ZodBoolean;
    resumeFrom: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    error: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    files: z.ZodArray<z.ZodString>;
    payload: z.ZodAny;
    producedAt: z.ZodString;
}, z.core.$strict>;
export type DownloadJobManifestV2 = z.infer<typeof downloadJobManifestV2>;
