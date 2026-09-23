import { z } from 'zod';
export declare const validationRunRequestV1: z.ZodObject<{
    schema: z.ZodLiteral<"heisentick/validation-run-request">;
    version: z.ZodLiteral<1>;
    requestKey: z.ZodString;
    kind: z.ZodEnum<{
        report: "report";
        validate: "validate";
        basket: "basket";
    }>;
    strategyId: z.ZodString;
    sourceSha256: z.ZodOptional<z.ZodString>;
    route: z.ZodObject<{
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
        routeMode: z.ZodOptional<z.ZodEnum<{
            declared: "declared";
            transfer: "transfer";
        }>>;
        rangeMethod: z.ZodDefault<z.ZodEnum<{
            zone: "zone";
            pivot: "pivot";
        }>>;
    }, z.core.$strict>;
    costMode: z.ZodEnum<{
        raw: "raw";
        realistic: "realistic";
        harsh: "harsh";
    }>;
    window: z.ZodOptional<z.ZodObject<{
        from: z.ZodOptional<z.ZodString>;
        to: z.ZodOptional<z.ZodString>;
        holdoutFrom: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    monteCarloIterations: z.ZodOptional<z.ZodNumber>;
    seed: z.ZodOptional<z.ZodNumber>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodBoolean]>>>;
}, z.core.$strict>;
export type ValidationRunRequestV1 = z.infer<typeof validationRunRequestV1>;
