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
    })
);

export const jobSchema = z.object({
    title: z.string().min(1, "Title is required"),
    url: z.string().url("Must be a valid URL"),
    folder_id: z.number().optional(),
    method: z.number().int("Method must be a number"),
    headers: jobHeadersSchema.optional().default([]),
    auth: jobAuthSchema.optional().default({ enabled: false, username: "", password: "" }),
    body: z.string().optional().default(""),
    cron: z.string().min(1, "Cron expression is required"),
    timezone: z.string().min(1, "Timezone is required"),
    timeout: z.number().int().min(1, "Timeout must be at least 1"),
    enabled: z.boolean().default(true),
});
