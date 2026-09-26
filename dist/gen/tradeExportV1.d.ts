import { z } from 'zod';
export declare const tradeExportV1: z.ZodObject<{
    schema: z.ZodLiteral<"heisentick/trade-export">;
    version: z.ZodLiteral<1>;
    strategy: z.ZodObject<{
        id: z.ZodString;
        sourceCommit: z.ZodString;
        stratDigest: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    engine: z.ZodObject<{
        repo: z.ZodLiteral<"heisentick-strat">;
        release: z.ZodString;
    }, z.core.$strict>;
    dataSha256: z.ZodArray<z.ZodObject<{
        file: z.ZodString;
        sha256: z.ZodString;
    }, z.core.$strict>>;
    runConfig: z.ZodObject<{
        costMode: z.ZodEnum<{
            raw: "raw";
            realistic: "realistic";
            harsh: "harsh";
        }>;
        slippage: z.ZodNumber;
        slippageBps: z.ZodOptional<z.ZodNumber>;
        riskUsd: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
    routes: z.ZodArray<z.ZodObject<{
        symbol: z.ZodString;
        tf: z.ZodEnum<{
            "1m": "1m";
            "5m": "5m";
            "15m": "15m";
            "30m": "30m";
            "1h": "1h";
            "4h": "4h";
            "1d": "1d";
        }>;
    }, z.core.$strict>>;
    generatedAt: z.ZodNumber;
    trades: z.ZodArray<z.ZodObject<{
        signalId: z.ZodString;
        symbol: z.ZodString;
        tf: z.ZodEnum<{
            "1m": "1m";
            "5m": "5m";
            "15m": "15m";
            "30m": "30m";
            "1h": "1h";
            "4h": "4h";
            "1d": "1d";
        }>;
        side: z.ZodEnum<{
            long: "long";
            short: "short";
        }>;
        entryTs: z.ZodNumber;
        entryPrice: z.ZodNumber;
        exitTs: z.ZodNumber;
        exitPrice: z.ZodNumber;
        initialSl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        initialTp: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        rNetGross: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        rNetAfterCosts: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        exitReason: z.ZodEnum<{
            rule: "rule";
            sl: "sl";
            tp: "tp";
            time: "time";
            partial: "partial";
            "end-of-test": "end-of-test";
        }>;
        exitRule: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
        mfeR: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        maeR: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        timeToMfeBars: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        postExitMfeR: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        postExitMaeR: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
        costModelId: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type TradeExportV1 = z.infer<typeof tradeExportV1>;
