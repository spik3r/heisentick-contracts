import { z } from 'zod';
export declare const validationRunManifestV1: z.ZodObject<{
    schema: z.ZodLiteral<"heisentick/validation-run-manifest">;
    version: z.ZodLiteral<1>;
    runId: z.ZodString;
    requestKey: z.ZodString;
    inputFingerprint: z.ZodString;
    kind: z.ZodEnum<{
        report: "report";
        validate: "validate";
        basket: "basket";
    }>;
    strategy: z.ZodObject<{
        id: z.ZodString;
        sourceSha256: z.ZodString;
        sourceObject: z.ZodOptional<z.ZodString>;
        params: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
    }, z.core.$strict>;
    engine: z.ZodObject<{
        stratRelease: z.ZodString;
        stratBuildDigest: z.ZodString;
        goVersion: z.ZodString;
        validationRelease: z.ZodString;
        reportSchemaVersion: z.ZodNumber;
        resultSchemaVersion: z.ZodNumber;
    }, z.core.$strict>;
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
        sourceTimeframe: z.ZodUnion<readonly [z.ZodEnum<{
            "1m": "1m";
            "5m": "5m";
            "15m": "15m";
            "30m": "30m";
            "1h": "1h";
            "4h": "4h";
            "1d": "1d";
        }>, z.ZodNull]>;
        higherTimeframe: z.ZodUnion<readonly [z.ZodEnum<{
            "1m": "1m";
            "5m": "5m";
            "15m": "15m";
            "30m": "30m";
            "1h": "1h";
            "4h": "4h";
            "1d": "1d";
        }>, z.ZodNull]>;
        rangeMethod: z.ZodEnum<{
            zone: "zone";
            pivot: "pivot";
        }>;
        instrument: z.ZodOptional<z.ZodObject<{
            tickSize: z.ZodNumber;
            pointValue: z.ZodNumber;
            quoteCurrency: z.ZodString;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    data: z.ZodObject<{
        provider: z.ZodEnum<{
            dukascopy: "dukascopy";
            binance: "binance";
            synthetic: "synthetic";
        }>;
        series: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<{
                entry: "entry";
                source: "source";
                higher: "higher";
                context: "context";
            }>;
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
            count: z.ZodNumber;
            windowFromT: z.ZodNumber;
            windowToT: z.ZodNumber;
        }, z.core.$strict>>;
    }, z.core.$strict>;
    execution: z.ZodObject<{
        fromT: z.ZodNumber;
        toT: z.ZodNumber;
        warmupBars: z.ZodNumber;
        fillOn: z.ZodEnum<{
            close: "close";
            "next-open": "next-open";
        }>;
        initialState: z.ZodLiteral<"flat">;
        endOfTest: z.ZodEnum<{
            "liquidate-last-close": "liquidate-last-close";
            "leave-open": "leave-open";
        }>;
        holdoutFromT: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
    }, z.core.$strict>;
    costs: z.ZodObject<{
        modelVersion: z.ZodNumber;
        mode: z.ZodEnum<{
            raw: "raw";
            realistic: "realistic";
            harsh: "harsh";
        }>;
        slippage: z.ZodNumber;
        slippageBps: z.ZodNumber;
        spread: z.ZodNumber;
        commissionPerUnit: z.ZodNumber;
        financingPerDayBps: z.ZodNumber;
        startEquity: z.ZodNumber;
    }, z.core.$strict>;
    validation: z.ZodObject<{
        grid: z.ZodUnion<readonly [z.ZodNull, z.ZodObject<{
            cells: z.ZodArray<z.ZodObject<{
                cellIndex: z.ZodNumber;
                params: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodBoolean]>>;
                costMode: z.ZodEnum<{
                    raw: "raw";
                    realistic: "realistic";
                    harsh: "harsh";
                }>;
            }, z.core.$strict>>;
        }, z.core.$strict>]>;
        monteCarlo: z.ZodUnion<readonly [z.ZodNull, z.ZodObject<{
            methods: z.ZodArray<z.ZodEnum<{
                permutation: "permutation";
                bootstrap: "bootstrap";
            }>>;
            iterations: z.ZodNumber;
            seed: z.ZodNumber;
        }, z.core.$strict>]>;
        diagnostics: z.ZodUnion<readonly [z.ZodNull, z.ZodObject<{
            recentMonths: z.ZodNumber;
            harshCostMode: z.ZodEnum<{
                raw: "raw";
                realistic: "realistic";
                harsh: "harsh";
            }>;
        }, z.core.$strict>]>;
    }, z.core.$strict>;
    policy: z.ZodObject<{
        promotionPolicyVersion: z.ZodNumber;
        profile: z.ZodString;
    }, z.core.$strict>;
    requestedBy: z.ZodObject<{
        subject: z.ZodString;
        via: z.ZodEnum<{
            "lab-ui": "lab-ui";
            "operator-token": "operator-token";
            local: "local";
        }>;
    }, z.core.$strict>;
    submittedAt: z.ZodNumber;
}, z.core.$strict>;
export type ValidationRunManifestV1 = z.infer<typeof validationRunManifestV1>;
