import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().optional(),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"]
});