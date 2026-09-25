import { z } from 'zod';
export declare const validationRunResultV2: z.ZodObject<{
    schema: z.ZodLiteral<"heisentick/validation-run-result">;
    version: z.ZodLiteral<2>;
    runId: z.ZodString;
    attempt: z.ZodNumber;
    inputFingerprint: z.ZodString;
    manifestKey: z.ZodString;
    execution: z.ZodObject<{
        status: z.ZodEnum<{
            succeeded: "succeeded";
            failed: "failed";
            cancelled: "cancelled";
            timeout: "timeout";
        }>;
        failedStage: z.ZodOptional<z.ZodEnum<{
            report: "report";
            grid: "grid";
            diagnostics: "diagnostics";
            montecarlo: "montecarlo";
            assemble: "assemble";
        }>>;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
        }, z.core.$strict>>;
        stages: z.ZodArray<z.ZodObject<{
            stage: z.ZodEnum<{
                report: "report";
                grid: "grid";
                diagnostics: "diagnostics";
                montecarlo: "montecarlo";
                assemble: "assemble";
            }>;
            status: z.ZodEnum<{
                succeeded: "succeeded";
                failed: "failed";
                timeout: "timeout";
                skipped: "skipped";
            }>;
            durationMs: z.ZodNumber;
            billedMs: z.ZodOptional<z.ZodNumber>;
            maxMemoryMb: z.ZodOptional<z.ZodNumber>;
            cells: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    assessment: z.ZodObject<{
        status: z.ZodEnum<{
            assessed: "assessed";
            "insufficient-data": "insufficient-data";
            "not-applicable": "not-applicable";
            unassessed: "unassessed";
        }>;
        reason: z.ZodOptional<z.ZodEnum<{
            "insufficient-data": "insufficient-data";
            "not-applicable": "not-applicable";
            "no-trades": "no-trades";
            "no-losses": "no-losses";
            "no-wins": "no-wins";
        }>>;
        minimumTrades: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
    promotion: z.ZodObject<{
        status: z.ZodEnum<{
            unassessed: "unassessed";
            eligible: "eligible";
            "not-eligible": "not-eligible";
        }>;
        policyVersion: z.ZodNumber;
        checks: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            passed: z.ZodBoolean;
            value: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
            threshold: z.ZodNumber;
            comparator: z.ZodEnum<{
                above: "above";
                below: "below";
                "at-least": "at-least";
                "at-most": "at-most";
            }>;
        }, z.core.$strict>>>;
    }, z.core.$strict>;
    headline: z.ZodUnion<readonly [z.ZodNull, z.ZodObject<{
        trades: z.ZodNumber;
        winRate: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        profitFactor: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        profitFactorReason: z.ZodOptional<z.ZodEnum<{
            "insufficient-data": "insufficient-data";
            "not-applicable": "not-applicable";
            "no-trades": "no-trades";
            "no-losses": "no-losses";
            "no-wins": "no-wins";
        }>>;
        net: z.ZodNumber;
        expectancy: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        maxDrawdown: z.ZodNumber;
        maxDrawdownUnit: z.ZodOptional<z.ZodEnum<{
            "percent-of-peak-equity": "percent-of-peak-equity";
            currency: "currency";
        }>>;
        firstTradeT: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        lastTradeT: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        monteCarlo: z.ZodOptional<z.ZodObject<{
            method: z.ZodEnum<{
                permutation: "permutation";
                bootstrap: "bootstrap";
            }>;
            iterations: z.ZodNumber;
            drawdownP5: z.ZodNumber;
            drawdownP50: z.ZodNumber;
            drawdownP95: z.ZodNumber;
        }, z.core.$strict>>;
        holdout: z.ZodOptional<z.ZodObject<{
            trades: z.ZodNumber;
            profitFactor: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
            net: z.ZodNumber;
        }, z.core.$strict>>;
    }, z.core.$strict>]>;
    artifacts: z.ZodObject<{
        report: z.ZodOptional<z.ZodObject<{
            object: z.ZodString;
            sha256: z.ZodString;
            byteLength: z.ZodNumber;
            schema: z.ZodString;
            version: z.ZodNumber;
        }, z.core.$strict>>;
        trades: z.ZodOptional<z.ZodObject<{
            object: z.ZodString;
            sha256: z.ZodString;
            byteLength: z.ZodNumber;
            schema: z.ZodString;
            version: z.ZodNumber;
        }, z.core.$strict>>;
        grid: z.ZodOptional<z.ZodObject<{
            object: z.ZodString;
            sha256: z.ZodString;
            byteLength: z.ZodNumber;
            schema: z.ZodString;
            version: z.ZodNumber;
        }, z.core.$strict>>;
        monteCarlo: z.ZodOptional<z.ZodObject<{
            object: z.ZodString;
            sha256: z.ZodString;
            byteLength: z.ZodNumber;
            schema: z.ZodString;
            version: z.ZodNumber;
        }, z.core.$strict>>;
        diagnostics: z.ZodOptional<z.ZodObject<{
            object: z.ZodString;
            sha256: z.ZodString;
            byteLength: z.ZodNumber;
            schema: z.ZodString;
            version: z.ZodNumber;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    engine: z.ZodObject<{
        linkedEngine: z.ZodAny;
        assembleExecutor: z.ZodObject<{
            sha256: z.ZodString;
        }, z.core.$strict>;
        validationRelease: z.ZodString;
    }, z.core.$strict>;
    finishedAt: z.ZodNumber;
}, z.core.$strict>;
export type ValidationRunResultV2 = z.infer<typeof validationRunResultV2>;
