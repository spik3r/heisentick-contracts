import { z } from 'zod';
export declare const cotJobManifestV2: z.ZodObject<{
    schema: z.ZodLiteral<"heisentick/cot-job-manifest">;
    version: z.ZodLiteral<2>;
    jobId: z.ZodString;
    datasetId: z.ZodEnum<{
        "gpe5-46if": "gpe5-46if";
        "72hh-3qpy": "72hh-3qpy";
    }>;
    contractCodes: z.ZodArray<z.ZodString>;
    requested: z.ZodObject<{
        from: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        to: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    }, z.core.$strict>;
    from: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    to: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    count: z.ZodNumber;
    complete: z.ZodBoolean;
    error: z.ZodAny;
    files: z.ZodArray<z.ZodString>;
    payload: z.ZodAny;
    producedAt: z.ZodString;
}, z.core.$strict>;
export type CotJobManifestV2 = z.infer<typeof cotJobManifestV2>;
