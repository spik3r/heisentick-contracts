export * from './gen/index.js';
export { canonicalJson, inputFingerprint, sha256Hex, CanonicalJsonError, MANIFEST_IDENTITY_FIELDS } from './canonical.js';
export type { JsonValue } from './canonical.js';
export declare const DOCUMENT_SCHEMAS: {
    readonly 'heisentick/bar-binary-layout': import("zod").ZodObject<{
        schema: import("zod").ZodLiteral<"heisentick/bar-binary-layout">;
        version: import("zod").ZodLiteral<1>;
        magic: import("zod").ZodLiteral<826430530>;
        layoutVersion: import("zod").ZodLiteral<1>;
        count: import("zod").ZodNumber;
        colCount: import("zod").ZodNumber;
        columns: import("zod").ZodArray<import("zod").ZodEnum<{
            t: "t";
            o: "o";
            h: "h";
            l: "l";
            c: "c";
            v: "v";
        }>>;
        byteLength: import("zod").ZodNumber;
        endianness: import("zod").ZodLiteral<"little">;
        headerBytes: import("zod").ZodLiteral<16>;
        valueBytes: import("zod").ZodLiteral<8>;
    }, import("zod/v4/core").$strict>;
    readonly 'heisentick/candle-snapshot-manifest': import("zod").ZodObject<{
        schema: import("zod").ZodLiteral<"heisentick/candle-snapshot-manifest">;
        version: import("zod").ZodLiteral<1>;
        symbol: import("zod").ZodString;
        timeframe: import("zod").ZodEnum<{
            "1m": "1m";
            "5m": "5m";
            "15m": "15m";
            "30m": "30m";
            "1h": "1h";
            "4h": "4h";
            "1d": "1d";
        }>;
        object: import("zod").ZodString;
        sha256: import("zod").ZodString;
        byteLength: import("zod").ZodNumber;
        count: import("zod").ZodNumber;
        firstT: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
        lastT: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
        layout: import("zod").ZodObject<{
            schema: import("zod").ZodLiteral<"heisentick/bar-binary-layout">;
            version: import("zod").ZodLiteral<1>;
            colCount: import("zod").ZodNumber;
        }, import("zod/v4/core").$strict>;
        publishedAt: import("zod").ZodNumber;
        producer: import("zod").ZodObject<{
            service: import("zod").ZodLiteral<"heisentick-api">;
            release: import("zod").ZodString;
            commitId: import("zod").ZodOptional<import("zod").ZodString>;
        }, import("zod/v4/core").$strict>;
        supersedes: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodNull]>>;
    }, import("zod/v4/core").$strict>;
    readonly 'heisentick/validation-run-manifest': import("zod").ZodObject<{
        schema: import("zod").ZodLiteral<"heisentick/validation-run-manifest">;
        version: import("zod").ZodLiteral<1>;
        runId: import("zod").ZodString;
        requestKey: import("zod").ZodString;
        inputFingerprint: import("zod").ZodString;
        kind: import("zod").ZodEnum<{
            report: "report";
            validate: "validate";
            basket: "basket";
        }>;
        strategy: import("zod").ZodObject<{
            id: import("zod").ZodString;
            sourceSha256: import("zod").ZodString;
            sourceObject: import("zod").ZodOptional<import("zod").ZodString>;
            params: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodString, import("zod").ZodBoolean]>>;
        }, import("zod/v4/core").$strict>;
        engine: import("zod").ZodObject<{
            stratRelease: import("zod").ZodString;
            stratBuildDigest: import("zod").ZodString;
            goVersion: import("zod").ZodString;
            validationRelease: import("zod").ZodString;
            reportSchemaVersion: import("zod").ZodNumber;
            resultSchemaVersion: import("zod").ZodNumber;
        }, import("zod/v4/core").$strict>;
        route: import("zod").ZodObject<{
            symbol: import("zod").ZodString;
            timeframe: import("zod").ZodEnum<{
                "1m": "1m";
                "5m": "5m";
                "15m": "15m";
                "30m": "30m";
                "1h": "1h";
                "4h": "4h";
                "1d": "1d";
            }>;
            sourceTimeframe: import("zod").ZodUnion<readonly [import("zod").ZodEnum<{
                "1m": "1m";
                "5m": "5m";
                "15m": "15m";
                "30m": "30m";
                "1h": "1h";
                "4h": "4h";
                "1d": "1d";
            }>, import("zod").ZodNull]>;
            higherTimeframe: import("zod").ZodUnion<readonly [import("zod").ZodEnum<{
                "1m": "1m";
                "5m": "5m";
                "15m": "15m";
                "30m": "30m";
                "1h": "1h";
                "4h": "4h";
                "1d": "1d";
            }>, import("zod").ZodNull]>;
            rangeMethod: import("zod").ZodEnum<{
                zone: "zone";
                pivot: "pivot";
            }>;
            instrument: import("zod").ZodOptional<import("zod").ZodObject<{
                tickSize: import("zod").ZodNumber;
                pointValue: import("zod").ZodNumber;
                quoteCurrency: import("zod").ZodString;
            }, import("zod/v4/core").$strict>>;
        }, import("zod/v4/core").$strict>;
        data: import("zod").ZodObject<{
            provider: import("zod").ZodEnum<{
                dukascopy: "dukascopy";
                binance: "binance";
                synthetic: "synthetic";
            }>;
            series: import("zod").ZodArray<import("zod").ZodObject<{
                role: import("zod").ZodEnum<{
                    entry: "entry";
                    source: "source";
                    higher: "higher";
                    context: "context";
                }>;
                symbol: import("zod").ZodString;
                timeframe: import("zod").ZodEnum<{
                    "1m": "1m";
                    "5m": "5m";
                    "15m": "15m";
                    "30m": "30m";
                    "1h": "1h";
                    "4h": "4h";
                    "1d": "1d";
                }>;
                object: import("zod").ZodString;
                sha256: import("zod").ZodString;
                count: import("zod").ZodNumber;
                windowFromT: import("zod").ZodNumber;
                windowToT: import("zod").ZodNumber;
            }, import("zod/v4/core").$strict>>;
        }, import("zod/v4/core").$strict>;
        execution: import("zod").ZodObject<{
            fromT: import("zod").ZodNumber;
            toT: import("zod").ZodNumber;
            warmupBars: import("zod").ZodNumber;
            fillOn: import("zod").ZodEnum<{
                close: "close";
                "next-open": "next-open";
            }>;
            initialState: import("zod").ZodLiteral<"flat">;
            endOfTest: import("zod").ZodEnum<{
                "liquidate-last-close": "liquidate-last-close";
                "leave-open": "leave-open";
            }>;
            holdoutFromT: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>>;
        }, import("zod/v4/core").$strict>;
        costs: import("zod").ZodObject<{
            modelVersion: import("zod").ZodNumber;
            mode: import("zod").ZodEnum<{
                raw: "raw";
                realistic: "realistic";
                harsh: "harsh";
            }>;
            slippage: import("zod").ZodNumber;
            slippageBps: import("zod").ZodNumber;
            spread: import("zod").ZodNumber;
            commissionPerUnit: import("zod").ZodNumber;
            financingPerDayBps: import("zod").ZodNumber;
            startEquity: import("zod").ZodNumber;
        }, import("zod/v4/core").$strict>;
        validation: import("zod").ZodObject<{
            grid: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodObject<{
                cells: import("zod").ZodArray<import("zod").ZodObject<{
                    cellIndex: import("zod").ZodNumber;
                    params: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodString, import("zod").ZodBoolean]>>;
                    costMode: import("zod").ZodEnum<{
                        raw: "raw";
                        realistic: "realistic";
                        harsh: "harsh";
                    }>;
                }, import("zod/v4/core").$strict>>;
            }, import("zod/v4/core").$strict>]>;
            monteCarlo: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodObject<{
                methods: import("zod").ZodArray<import("zod").ZodEnum<{
                    permutation: "permutation";
                    bootstrap: "bootstrap";
                }>>;
                iterations: import("zod").ZodNumber;
                seed: import("zod").ZodNumber;
            }, import("zod/v4/core").$strict>]>;
            diagnostics: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodObject<{
                recentMonths: import("zod").ZodNumber;
                harshCostMode: import("zod").ZodEnum<{
                    raw: "raw";
                    realistic: "realistic";
                    harsh: "harsh";
                }>;
            }, import("zod/v4/core").$strict>]>;
        }, import("zod/v4/core").$strict>;
        policy: import("zod").ZodObject<{
            promotionPolicyVersion: import("zod").ZodNumber;
            profile: import("zod").ZodString;
        }, import("zod/v4/core").$strict>;
        requestedBy: import("zod").ZodObject<{
            subject: import("zod").ZodString;
            via: import("zod").ZodEnum<{
                "lab-ui": "lab-ui";
                "operator-token": "operator-token";
                local: "local";
            }>;
        }, import("zod/v4/core").$strict>;
        submittedAt: import("zod").ZodNumber;
    }, import("zod/v4/core").$strict>;
    readonly 'heisentick/validation-run-request': import("zod").ZodObject<{
        schema: import("zod").ZodLiteral<"heisentick/validation-run-request">;
        version: import("zod").ZodLiteral<1>;
        requestKey: import("zod").ZodString;
        kind: import("zod").ZodEnum<{
            report: "report";
            validate: "validate";
            basket: "basket";
        }>;
        strategyId: import("zod").ZodString;
        sourceSha256: import("zod").ZodOptional<import("zod").ZodString>;
        route: import("zod").ZodObject<{
            symbol: import("zod").ZodString;
            timeframe: import("zod").ZodEnum<{
                "1m": "1m";
                "5m": "5m";
                "15m": "15m";
                "30m": "30m";
                "1h": "1h";
                "4h": "4h";
                "1d": "1d";
            }>;
            rangeMethod: import("zod").ZodDefault<import("zod").ZodEnum<{
                zone: "zone";
                pivot: "pivot";
            }>>;
        }, import("zod/v4/core").$strict>;
        costMode: import("zod").ZodEnum<{
            raw: "raw";
            realistic: "realistic";
            harsh: "harsh";
        }>;
        window: import("zod").ZodOptional<import("zod").ZodObject<{
            from: import("zod").ZodOptional<import("zod").ZodString>;
            to: import("zod").ZodOptional<import("zod").ZodString>;
            holdoutFrom: import("zod").ZodOptional<import("zod").ZodString>;
        }, import("zod/v4/core").$strict>>;
        monteCarloIterations: import("zod").ZodOptional<import("zod").ZodNumber>;
        seed: import("zod").ZodOptional<import("zod").ZodNumber>;
        params: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodString, import("zod").ZodBoolean]>>>;
    }, import("zod/v4/core").$strict>;
    readonly 'heisentick/validation-run-result': import("zod").ZodObject<{
        schema: import("zod").ZodLiteral<"heisentick/validation-run-result">;
        version: import("zod").ZodLiteral<1>;
        runId: import("zod").ZodString;
        attempt: import("zod").ZodNumber;
        inputFingerprint: import("zod").ZodString;
        manifestKey: import("zod").ZodString;
        execution: import("zod").ZodObject<{
            status: import("zod").ZodEnum<{
                succeeded: "succeeded";
                failed: "failed";
                cancelled: "cancelled";
                timeout: "timeout";
            }>;
            failedStage: import("zod").ZodOptional<import("zod").ZodEnum<{
                report: "report";
                grid: "grid";
                diagnostics: "diagnostics";
                montecarlo: "montecarlo";
                assemble: "assemble";
            }>>;
            error: import("zod").ZodOptional<import("zod").ZodObject<{
                code: import("zod").ZodString;
                message: import("zod").ZodString;
            }, import("zod/v4/core").$strict>>;
            stages: import("zod").ZodArray<import("zod").ZodObject<{
                stage: import("zod").ZodEnum<{
                    report: "report";
                    grid: "grid";
                    diagnostics: "diagnostics";
                    montecarlo: "montecarlo";
                    assemble: "assemble";
                }>;
                status: import("zod").ZodEnum<{
                    succeeded: "succeeded";
                    failed: "failed";
                    timeout: "timeout";
                    skipped: "skipped";
                }>;
                durationMs: import("zod").ZodNumber;
                billedMs: import("zod").ZodOptional<import("zod").ZodNumber>;
                maxMemoryMb: import("zod").ZodOptional<import("zod").ZodNumber>;
                cells: import("zod").ZodOptional<import("zod").ZodNumber>;
            }, import("zod/v4/core").$strict>>;
        }, import("zod/v4/core").$strict>;
        assessment: import("zod").ZodObject<{
            status: import("zod").ZodEnum<{
                assessed: "assessed";
                "insufficient-data": "insufficient-data";
                "not-applicable": "not-applicable";
                unassessed: "unassessed";
            }>;
            reason: import("zod").ZodOptional<import("zod").ZodEnum<{
                "insufficient-data": "insufficient-data";
                "not-applicable": "not-applicable";
                "no-trades": "no-trades";
                "no-losses": "no-losses";
                "no-wins": "no-wins";
            }>>;
            minimumTrades: import("zod").ZodOptional<import("zod").ZodNumber>;
        }, import("zod/v4/core").$strict>;
        promotion: import("zod").ZodObject<{
            status: import("zod").ZodEnum<{
                unassessed: "unassessed";
                eligible: "eligible";
                "not-eligible": "not-eligible";
            }>;
            policyVersion: import("zod").ZodNumber;
            checks: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                name: import("zod").ZodString;
                passed: import("zod").ZodBoolean;
                value: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
                threshold: import("zod").ZodNumber;
                comparator: import("zod").ZodOptional<import("zod").ZodEnum<{
                    "at-least": "at-least";
                    above: "above";
                    "at-most": "at-most";
                    below: "below";
                }>>;
            }, import("zod/v4/core").$strict>>>;
        }, import("zod/v4/core").$strict>;
        headline: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodObject<{
            trades: import("zod").ZodNumber;
            winRate: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            profitFactor: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            profitFactorReason: import("zod").ZodOptional<import("zod").ZodEnum<{
                "insufficient-data": "insufficient-data";
                "not-applicable": "not-applicable";
                "no-trades": "no-trades";
                "no-losses": "no-losses";
                "no-wins": "no-wins";
            }>>;
            net: import("zod").ZodNumber;
            expectancy: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            maxDrawdown: import("zod").ZodNumber;
            firstTradeT: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            lastTradeT: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            monteCarlo: import("zod").ZodOptional<import("zod").ZodObject<{
                method: import("zod").ZodEnum<{
                    permutation: "permutation";
                    bootstrap: "bootstrap";
                }>;
                iterations: import("zod").ZodNumber;
                drawdownP5: import("zod").ZodNumber;
                drawdownP50: import("zod").ZodNumber;
                drawdownP95: import("zod").ZodNumber;
            }, import("zod/v4/core").$strict>>;
            holdout: import("zod").ZodOptional<import("zod").ZodObject<{
                trades: import("zod").ZodNumber;
                profitFactor: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
                net: import("zod").ZodNumber;
            }, import("zod/v4/core").$strict>>;
        }, import("zod/v4/core").$strict>]>;
        artifacts: import("zod").ZodObject<{
            report: import("zod").ZodObject<{
                object: import("zod").ZodString;
                sha256: import("zod").ZodString;
                byteLength: import("zod").ZodNumber;
                schema: import("zod").ZodString;
                version: import("zod").ZodNumber;
            }, import("zod/v4/core").$strict>;
            trades: import("zod").ZodOptional<import("zod").ZodObject<{
                object: import("zod").ZodString;
                sha256: import("zod").ZodString;
                byteLength: import("zod").ZodNumber;
                schema: import("zod").ZodString;
                version: import("zod").ZodNumber;
            }, import("zod/v4/core").$strict>>;
            grid: import("zod").ZodOptional<import("zod").ZodObject<{
                object: import("zod").ZodString;
                sha256: import("zod").ZodString;
                byteLength: import("zod").ZodNumber;
                schema: import("zod").ZodString;
                version: import("zod").ZodNumber;
            }, import("zod/v4/core").$strict>>;
            monteCarlo: import("zod").ZodOptional<import("zod").ZodObject<{
                object: import("zod").ZodString;
                sha256: import("zod").ZodString;
                byteLength: import("zod").ZodNumber;
                schema: import("zod").ZodString;
                version: import("zod").ZodNumber;
            }, import("zod/v4/core").$strict>>;
            diagnostics: import("zod").ZodOptional<import("zod").ZodObject<{
                object: import("zod").ZodString;
                sha256: import("zod").ZodString;
                byteLength: import("zod").ZodNumber;
                schema: import("zod").ZodString;
                version: import("zod").ZodNumber;
            }, import("zod/v4/core").$strict>>;
        }, import("zod/v4/core").$strict>;
        engine: import("zod").ZodObject<{
            stratRelease: import("zod").ZodString;
            stratBuildDigest: import("zod").ZodString;
            validationRelease: import("zod").ZodString;
        }, import("zod/v4/core").$strict>;
        finishedAt: import("zod").ZodNumber;
    }, import("zod/v4/core").$strict>;
    readonly 'heisentick/validation-request-message': import("zod").ZodObject<{
        schema: import("zod").ZodLiteral<"heisentick/validation-request-message">;
        version: import("zod").ZodLiteral<1>;
        runId: import("zod").ZodString;
        attempt: import("zod").ZodNumber;
        manifestKey: import("zod").ZodString;
        manifestSha256: import("zod").ZodOptional<import("zod").ZodString>;
        inputFingerprint: import("zod").ZodString;
        submittedAt: import("zod").ZodNumber;
    }, import("zod/v4/core").$strict>;
    readonly 'heisentick/validation-result-message': import("zod").ZodObject<{
        schema: import("zod").ZodLiteral<"heisentick/validation-result-message">;
        version: import("zod").ZodLiteral<1>;
        runId: import("zod").ZodString;
        attempt: import("zod").ZodNumber;
        status: import("zod").ZodEnum<{
            succeeded: "succeeded";
            failed: "failed";
            cancelled: "cancelled";
            timeout: "timeout";
        }>;
        envelopeKey: import("zod").ZodString;
        envelopeSha256: import("zod").ZodOptional<import("zod").ZodString>;
        executionArn: import("zod").ZodOptional<import("zod").ZodString>;
        finishedAt: import("zod").ZodNumber;
    }, import("zod/v4/core").$strict>;
};
export type DocumentSchemaName = keyof typeof DOCUMENT_SCHEMAS;
export declare class ContractError extends Error {
    readonly schema: string | null;
    readonly issues: readonly string[];
    constructor(message: string, schema: string | null, issues?: readonly string[]);
}
export declare function parseDocument<N extends DocumentSchemaName>(name: N, value: unknown): ReturnType<(typeof DOCUMENT_SCHEMAS)[N]['parse']>;
export declare function parseAnyDocument(value: unknown): {
    schema: DocumentSchemaName;
    document: unknown;
};
