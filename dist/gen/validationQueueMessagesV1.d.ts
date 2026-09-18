import { z } from 'zod';
export declare const validationQueueMessagesV1ValidationRequestMessage: z.ZodObject<{
    schema: z.ZodLiteral<"heisentick/validation-request-message">;
    version: z.ZodLiteral<1>;
    runId: z.ZodString;
    attempt: z.ZodNumber;
    manifestKey: z.ZodString;
    manifestSha256: z.ZodOptional<z.ZodString>;
    inputFingerprint: z.ZodString;
    submittedAt: z.ZodNumber;
}, z.core.$strict>;
export type ValidationQueueMessagesV1ValidationRequestMessage = z.infer<typeof validationQueueMessagesV1ValidationRequestMessage>;
export declare const validationQueueMessagesV1ValidationResultMessage: z.ZodObject<{
    schema: z.ZodLiteral<"heisentick/validation-result-message">;
    version: z.ZodLiteral<1>;
    runId: z.ZodString;
    attempt: z.ZodNumber;
    status: z.ZodEnum<{
        succeeded: "succeeded";
        failed: "failed";
        cancelled: "cancelled";
        timeout: "timeout";
    }>;
    envelopeKey: z.ZodString;
    envelopeSha256: z.ZodOptional<z.ZodString>;
    executionArn: z.ZodOptional<z.ZodString>;
    finishedAt: z.ZodNumber;
}, z.core.$strict>;
export type ValidationQueueMessagesV1ValidationResultMessage = z.infer<typeof validationQueueMessagesV1ValidationResultMessage>;
export declare const validationQueueMessagesV1: z.ZodUnion<readonly [z.ZodObject<{
    schema: z.ZodLiteral<"heisentick/validation-request-message">;
    version: z.ZodLiteral<1>;
    runId: z.ZodString;
    attempt: z.ZodNumber;
    manifestKey: z.ZodString;
    manifestSha256: z.ZodOptional<z.ZodString>;
    inputFingerprint: z.ZodString;
    submittedAt: z.ZodNumber;
}, z.core.$strict>, z.ZodObject<{
    schema: z.ZodLiteral<"heisentick/validation-result-message">;
    version: z.ZodLiteral<1>;
    runId: z.ZodString;
    attempt: z.ZodNumber;
    status: z.ZodEnum<{
        succeeded: "succeeded";
        failed: "failed";
        cancelled: "cancelled";
        timeout: "timeout";
    }>;
    envelopeKey: z.ZodString;
    envelopeSha256: z.ZodOptional<z.ZodString>;
    executionArn: z.ZodOptional<z.ZodString>;
    finishedAt: z.ZodNumber;
}, z.core.$strict>]>;
export type ValidationQueueMessagesV1 = z.infer<typeof validationQueueMessagesV1>;
