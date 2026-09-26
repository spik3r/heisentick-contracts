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
    readonly 'heisentick/validation-run-manifest': import("zod").ZodUnion<[import("zod").ZodObject<{
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
            routeMode: import("zod").ZodOptional<import("zod").ZodEnum<{
                declared: "declared";
                transfer: "transfer";
            }>>;
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
                    source: "source";
                    entry: "entry";
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
    }, import("zod/v4/core").$strict>, import("zod").ZodObject<{
        schema: import("zod").ZodLiteral<"heisentick/validation-run-manifest">;
        version: import("zod").ZodLiteral<2>;
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
            stratReleaseArtifact: import("zod").ZodObject<{
                release: import("zod").ZodString;
                assetName: import("zod").ZodString;
                sha256: import("zod").ZodString;
            }, import("zod/v4/core").$strict>;
            expectedLinkedModule: import("zod").ZodObject<{
                modulePath: import("zod").ZodLiteral<"github.com/spik3r/heisentick-strat">;
                release: import("zod").ZodString;
                moduleSum: import("zod").ZodString;
            }, import("zod/v4/core").$strict>;
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
            routeMode: import("zod").ZodOptional<import("zod").ZodEnum<{
                declared: "declared";
                transfer: "transfer";
            }>>;
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
                    source: "source";
                    entry: "entry";
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
    }, import("zod/v4/core").$strict>]>;
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
            routeMode: import("zod").ZodOptional<import("zod").ZodEnum<{
                declared: "declared";
                transfer: "transfer";
            }>>;
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
    readonly 'heisentick/validation-run-result': import("zod").ZodUnion<[import("zod").ZodObject<{
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
                comparator: import("zod").ZodEnum<{
                    above: "above";
                    below: "below";
                    "at-least": "at-least";
                    "at-most": "at-most";
                }>;
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
            maxDrawdownUnit: import("zod").ZodOptional<import("zod").ZodEnum<{
                "percent-of-peak-equity": "percent-of-peak-equity";
                currency: "currency";
            }>>;
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
            report: import("zod").ZodOptional<import("zod").ZodObject<{
                object: import("zod").ZodString;
                sha256: import("zod").ZodString;
                byteLength: import("zod").ZodNumber;
                schema: import("zod").ZodString;
                version: import("zod").ZodNumber;
            }, import("zod/v4/core").$strict>>;
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
    }, import("zod/v4/core").$strict>, import("zod").ZodObject<{
        schema: import("zod").ZodLiteral<"heisentick/validation-run-result">;
        version: import("zod").ZodLiteral<2>;
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
                comparator: import("zod").ZodEnum<{
                    above: "above";
                    below: "below";
                    "at-least": "at-least";
                    "at-most": "at-most";
                }>;
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
            maxDrawdownUnit: import("zod").ZodOptional<import("zod").ZodEnum<{
                "percent-of-peak-equity": "percent-of-peak-equity";
                currency: "currency";
            }>>;
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
            report: import("zod").ZodOptional<import("zod").ZodObject<{
                object: import("zod").ZodString;
                sha256: import("zod").ZodString;
                byteLength: import("zod").ZodNumber;
                schema: import("zod").ZodString;
                version: import("zod").ZodNumber;
            }, import("zod/v4/core").$strict>>;
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
            linkedEngine: import("zod").ZodAny;
            assembleExecutor: import("zod").ZodObject<{
                sha256: import("zod").ZodString;
            }, import("zod/v4/core").$strict>;
            validationRelease: import("zod").ZodString;
        }, import("zod/v4/core").$strict>;
        finishedAt: import("zod").ZodNumber;
    }, import("zod/v4/core").$strict>]>;
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
    readonly 'heisentick/session-feature-rows': import("zod").ZodObject<{
        schema: import("zod").ZodLiteral<"heisentick/session-feature-rows">;
        version: import("zod").ZodLiteral<1>;
        instrument: import("zod").ZodString;
        timeframe: import("zod").ZodEnum<{
            "1m": "1m";
            "5m": "5m";
            "15m": "15m";
            "30m": "30m";
            "1h": "1h";
            "4h": "4h";
            "1d": "1d";
        }>;
        sessionConfig: import("zod").ZodObject<{
            asiaStartHourUtc: import("zod").ZodNumber;
            asiaEndHourUtc: import("zod").ZodNumber;
            londonStartHourUtc: import("zod").ZodNumber;
            valueAreaPercent: import("zod").ZodOptional<import("zod").ZodNumber>;
            sessionRows: import("zod").ZodOptional<import("zod").ZodNumber>;
            dayRows: import("zod").ZodOptional<import("zod").ZodNumber>;
            minAsiaBars: import("zod").ZodOptional<import("zod").ZodNumber>;
        }, import("zod/v4/core").$strict>;
        engine: import("zod").ZodObject<{
            package: import("zod").ZodLiteral<"@heisentick/engine">;
            version: import("zod").ZodOptional<import("zod").ZodString>;
            gitSha: import("zod").ZodOptional<import("zod").ZodString>;
        }, import("zod/v4/core").$strict>;
        source: import("zod").ZodObject<{
            dataFile: import("zod").ZodString;
            sha256: import("zod").ZodOptional<import("zod").ZodString>;
        }, import("zod/v4/core").$strict>;
        generatedAt: import("zod").ZodNumber;
        rows: import("zod").ZodArray<import("zod").ZodObject<{
            date: import("zod").ZodString;
            decisionTs: import("zod").ZodNumber;
            asia: import("zod").ZodObject<{
                open: import("zod").ZodNumber;
                high: import("zod").ZodNumber;
                low: import("zod").ZodNumber;
                close: import("zod").ZodNumber;
                barCount: import("zod").ZodNumber;
                poc: import("zod").ZodNumber;
                vah: import("zod").ZodNumber;
                val: import("zod").ZodNumber;
                delta: import("zod").ZodNumber;
                rangeEstimators: import("zod").ZodOptional<import("zod").ZodObject<{
                    parkinsonBp: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodNumber]>;
                    garmanKlassBp: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodNumber]>;
                    rogersSatchellBp: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodNumber]>;
                }, import("zod/v4/core").$strict>>;
            }, import("zod/v4/core").$strict>;
            londonOpen: import("zod").ZodNumber;
            priorDayAtr14: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodNumber]>>;
            priorDay: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodObject<{
                high: import("zod").ZodNumber;
                low: import("zod").ZodNumber;
                close: import("zod").ZodOptional<import("zod").ZodNumber>;
                poc: import("zod").ZodNumber;
                vah: import("zod").ZodNumber;
                val: import("zod").ZodNumber;
            }, import("zod/v4/core").$strict>]>;
            features: import("zod").ZodObject<{
                asiaPocZone: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodEnum<{
                    bottom: "bottom";
                    middle: "middle";
                    top: "top";
                }>]>;
                asiaPocSide: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodEnum<{
                    belowMid: "belowMid";
                    aboveMid: "aboveMid";
                    nearMid: "nearMid";
                }>]>;
                asiaCloseVsPoc: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodEnum<{
                    above: "above";
                    below: "below";
                    at: "at";
                }>]>;
                londonOpenVsAsiaPoc: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodEnum<{
                    above: "above";
                    below: "below";
                    at: "at";
                }>]>;
                londonOpenVsAsiaValue: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodEnum<{
                    aboveVA: "aboveVA";
                    belowVA: "belowVA";
                    insideVA: "insideVA";
                }>]>;
                asiaDeltaSign: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodEnum<{
                    positive: "positive";
                    negative: "negative";
                    flat: "flat";
                }>]>;
                asiaDirection: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodEnum<{
                    flat: "flat";
                    up: "up";
                    down: "down";
                }>]>;
                asiaVaWidth: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodEnum<{
                    narrow: "narrow";
                    normal: "normal";
                    wide: "wide";
                }>]>;
                priorDayPocZone: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodEnum<{
                    bottom: "bottom";
                    middle: "middle";
                    top: "top";
                }>]>;
                priorDayCloseVsPoc: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodEnum<{
                    above: "above";
                    below: "below";
                    at: "at";
                }>]>;
                londonOpenVsPriorDayPoc: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodEnum<{
                    above: "above";
                    below: "below";
                    at: "at";
                }>]>;
                londonOpenVsPriorDayValue: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodEnum<{
                    aboveVA: "aboveVA";
                    belowVA: "belowVA";
                    insideVA: "insideVA";
                }>]>;
                asiaPocVsPriorDayPoc: import("zod").ZodUnion<readonly [import("zod").ZodNull, import("zod").ZodEnum<{
                    above: "above";
                    below: "below";
                    at: "at";
                }>]>;
            }, import("zod/v4/core").$strict>;
        }, import("zod/v4/core").$strict>>;
    }, import("zod/v4/core").$strict>;
    readonly 'heisentick/trade-export': import("zod").ZodObject<{
        schema: import("zod").ZodLiteral<"heisentick/trade-export">;
        version: import("zod").ZodLiteral<1>;
        strategy: import("zod").ZodObject<{
            id: import("zod").ZodString;
            sourceCommit: import("zod").ZodString;
            stratDigest: import("zod").ZodOptional<import("zod").ZodString>;
        }, import("zod/v4/core").$strict>;
        engine: import("zod").ZodObject<{
            repo: import("zod").ZodLiteral<"heisentick-strat">;
            release: import("zod").ZodString;
        }, import("zod/v4/core").$strict>;
        dataSha256: import("zod").ZodArray<import("zod").ZodObject<{
            file: import("zod").ZodString;
            sha256: import("zod").ZodString;
        }, import("zod/v4/core").$strict>>;
        runConfig: import("zod").ZodObject<{
            costMode: import("zod").ZodEnum<{
                raw: "raw";
                realistic: "realistic";
                harsh: "harsh";
            }>;
            slippage: import("zod").ZodNumber;
            slippageBps: import("zod").ZodOptional<import("zod").ZodNumber>;
            riskUsd: import("zod").ZodOptional<import("zod").ZodNumber>;
        }, import("zod/v4/core").$strict>;
        routes: import("zod").ZodArray<import("zod").ZodObject<{
            symbol: import("zod").ZodString;
            tf: import("zod").ZodEnum<{
                "1m": "1m";
                "5m": "5m";
                "15m": "15m";
                "30m": "30m";
                "1h": "1h";
                "4h": "4h";
                "1d": "1d";
            }>;
        }, import("zod/v4/core").$strict>>;
        generatedAt: import("zod").ZodNumber;
        trades: import("zod").ZodArray<import("zod").ZodObject<{
            signalId: import("zod").ZodString;
            symbol: import("zod").ZodString;
            tf: import("zod").ZodEnum<{
                "1m": "1m";
                "5m": "5m";
                "15m": "15m";
                "30m": "30m";
                "1h": "1h";
                "4h": "4h";
                "1d": "1d";
            }>;
            side: import("zod").ZodEnum<{
                long: "long";
                short: "short";
            }>;
            entryTs: import("zod").ZodNumber;
            entryPrice: import("zod").ZodNumber;
            exitTs: import("zod").ZodNumber;
            exitPrice: import("zod").ZodNumber;
            initialSl: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            initialTp: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            rNetGross: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            rNetAfterCosts: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            exitReason: import("zod").ZodEnum<{
                rule: "rule";
                sl: "sl";
                tp: "tp";
                time: "time";
                partial: "partial";
                "end-of-test": "end-of-test";
            }>;
            exitRule: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodNull]>>;
            mfeR: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            maeR: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            timeToMfeBars: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            postExitMfeR: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            postExitMaeR: import("zod").ZodUnion<readonly [import("zod").ZodNumber, import("zod").ZodNull]>;
            costModelId: import("zod").ZodString;
        }, import("zod/v4/core").$strict>>;
    }, import("zod/v4/core").$strict>;
};
export type DocumentSchemaName = keyof typeof DOCUMENT_SCHEMAS;
export declare class ContractError extends Error {
    readonly schema: string | null;
    readonly issues: readonly string[];
    constructor(message: string, schema: string | null, issues?: readonly string[]);
}
export declare function parseDocument<N extends DocumentSchemaName>(name: N, value: unknown): ReturnType<(typeof DOCUMENT_SCHEMAS)[N]['parse']>;
export declare function crossFieldIssues(name: DocumentSchemaName, doc: unknown): string[];
export declare function parseAnyDocument(value: unknown): {
    schema: DocumentSchemaName;
    document: unknown;
};
