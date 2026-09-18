import { z } from 'zod';
export declare const barBinaryLayoutV1: z.ZodObject<{
    schema: z.ZodLiteral<"heisentick/bar-binary-layout">;
    version: z.ZodLiteral<1>;
    magic: z.ZodLiteral<826430530>;
    layoutVersion: z.ZodLiteral<1>;
    count: z.ZodNumber;
    colCount: z.ZodNumber;
    columns: z.ZodArray<z.ZodEnum<{
        t: "t";
        o: "o";
        h: "h";
        l: "l";
        c: "c";
        v: "v";
    }>>;
    byteLength: z.ZodNumber;
    endianness: z.ZodLiteral<"little">;
    headerBytes: z.ZodLiteral<16>;
    valueBytes: z.ZodLiteral<8>;
}, z.core.$strict>;
export type BarBinaryLayoutV1 = z.infer<typeof barBinaryLayoutV1>;
