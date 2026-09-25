import { z } from 'zod';
export declare const sessionFeatureRowsV1: z.ZodObject<{
    schema: z.ZodLiteral<"heisentick/session-feature-rows">;
    version: z.ZodLiteral<1>;
    instrument: z.ZodString;
    timeframe: z.ZodEnum<{
        "1m": "1m";
        "5m": "5m";
        "15m": "15m";
        "30m": "30m";
        "1h": "1h";
        "4h": "4h";
        "1d": "1d";
    }>;
    sessionConfig: z.ZodObject<{
        asiaStartHourUtc: z.ZodNumber;
        asiaEndHourUtc: z.ZodNumber;
        londonStartHourUtc: z.ZodNumber;
        valueAreaPercent: z.ZodOptional<z.ZodNumber>;
        sessionRows: z.ZodOptional<z.ZodNumber>;
        dayRows: z.ZodOptional<z.ZodNumber>;
        minAsiaBars: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>;
    engine: z.ZodObject<{
        package: z.ZodLiteral<"@heisentick/engine">;
        version: z.ZodOptional<z.ZodString>;
        gitSha: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    source: z.ZodObject<{
        dataFile: z.ZodString;
        sha256: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    generatedAt: z.ZodNumber;
    rows: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        decisionTs: z.ZodNumber;
        asia: z.ZodObject<{
            open: z.ZodNumber;
            high: z.ZodNumber;
            low: z.ZodNumber;
            close: z.ZodNumber;
            barCount: z.ZodNumber;
            poc: z.ZodNumber;
            vah: z.ZodNumber;
            val: z.ZodNumber;
            delta: z.ZodNumber;
        }, z.core.$strict>;
        londonOpen: z.ZodNumber;
        priorDay: z.ZodUnion<readonly [z.ZodNull, z.ZodObject<{
            high: z.ZodNumber;
            low: z.ZodNumber;
            poc: z.ZodNumber;
            vah: z.ZodNumber;
            val: z.ZodNumber;
        }, z.core.$strict>]>;
        features: z.ZodObject<{
            asiaPocZone: z.ZodUnion<readonly [z.ZodNull, z.ZodEnum<{
                bottom: "bottom";
                middle: "middle";
                top: "top";
            }>]>;
            asiaPocSide: z.ZodUnion<readonly [z.ZodNull, z.ZodEnum<{
                belowMid: "belowMid";
                aboveMid: "aboveMid";
                nearMid: "nearMid";
            }>]>;
            asiaCloseVsPoc: z.ZodUnion<readonly [z.ZodNull, z.ZodEnum<{
                above: "above";
                below: "below";
                at: "at";
            }>]>;
            londonOpenVsAsiaPoc: z.ZodUnion<readonly [z.ZodNull, z.ZodEnum<{
                above: "above";
                below: "below";
                at: "at";
            }>]>;
            londonOpenVsAsiaValue: z.ZodUnion<readonly [z.ZodNull, z.ZodEnum<{
                aboveVA: "aboveVA";
                belowVA: "belowVA";
                insideVA: "insideVA";
            }>]>;
            asiaDeltaSign: z.ZodUnion<readonly [z.ZodNull, z.ZodEnum<{
                positive: "positive";
                negative: "negative";
                flat: "flat";
            }>]>;
            asiaDirection: z.ZodUnion<readonly [z.ZodNull, z.ZodEnum<{
                flat: "flat";
                up: "up";
                down: "down";
            }>]>;
            asiaVaWidth: z.ZodUnion<readonly [z.ZodNull, z.ZodEnum<{
                narrow: "narrow";
                normal: "normal";
                wide: "wide";
            }>]>;
            priorDayPocZone: z.ZodUnion<readonly [z.ZodNull, z.ZodEnum<{
                bottom: "bottom";
                middle: "middle";
                top: "top";
            }>]>;
            priorDayCloseVsPoc: z.ZodUnion<readonly [z.ZodNull, z.ZodEnum<{
                above: "above";
                below: "below";
                at: "at";
            }>]>;
            londonOpenVsPriorDayPoc: z.ZodUnion<readonly [z.ZodNull, z.ZodEnum<{
                above: "above";
                below: "below";
                at: "at";
            }>]>;
            londonOpenVsPriorDayValue: z.ZodUnion<readonly [z.ZodNull, z.ZodEnum<{
                aboveVA: "aboveVA";
                belowVA: "belowVA";
                insideVA: "insideVA";
            }>]>;
            asiaPocVsPriorDayPoc: z.ZodUnion<readonly [z.ZodNull, z.ZodEnum<{
                above: "above";
                below: "below";
                at: "at";
            }>]>;
        }, z.core.$strict>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type SessionFeatureRowsV1 = z.infer<typeof sessionFeatureRowsV1>;
