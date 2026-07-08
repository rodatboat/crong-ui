import { LOGGER } from "$lib/logger";
import { z } from "zod";

export const jobAuthSchema = z.object({
    enabled: z.boolean(),
    username: z.string().optional(),
    password: z.string().optional(),
});

export const jobHeadersSchema = z.array(
    z.object({
        key: z.string().min(1, "Header key is required"),
        value: z.string(),
    })).superRefine((headers, ctx) => {
        const seen = new Map<string, number>();

        headers.forEach((header, index) => {
            const key = header.key.trim().toLowerCase();

            if (!key) return;

            if (seen.has(key)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [],
                    message: "Header names must be unique."
                });
            } else {
                seen.set(key, index);
            }
        });
        LOGGER.warn("Schema validation error(s): ", ctx);
    });

export const jobSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be at most 255 characters"),
    url: z.string().min(1, "URL is required").max(2048, "URL must be at most 2048 characters").url("Must be a valid URL"),
    folder_id: z.number().optional(),
    method: z.number().min(0, "Method is invalid").int("Method must be a number"),
    headers: jobHeadersSchema.optional().default([]),
    auth: jobAuthSchema.optional().default({ enabled: false, username: "", password: "" }),
    body: z.string().max(10000, "Body must be at most 10000 characters").optional().default(""),
    cron: z.string().min(1, "Cron expression is required").max(100, "Cron expression must be at most 100 characters"),
    timezone: z.string().min(1, "Timezone is required"),
    timeout: z.number().int().min(0, "Timeout must be at least 0").max(30, "Timeout must be at most 30"),
    enabled: z.boolean().default(true),
});
