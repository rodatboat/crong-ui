import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZodError, ZodSafeParseResult, ZodType } from "zod";
import type { APIResponse, ValidationErrors } from "$lib/types";
import { LOGGER } from "$lib//logger";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function validateForm(schema: ZodType<unknown>, data: unknown): ValidationErrors {
	const result: ZodSafeParseResult<unknown> = schema.safeParse(data);
	if (result.success) {
        return {};
    }

	const resultErrors = result.error as ZodError;

	return Object.fromEntries(
		resultErrors.issues.map((issue) => [String(issue.path[0]), issue.message])
	);
}

export async function fetchAPI<T extends APIResponse>(
	url: string,
	options: RequestInit
): Promise<T> {
	try {
		const resp = await fetch(url, options);
		const result = await resp.json();
		LOGGER.info(`API response: status ${result.status}`);
		return result;
	} catch (err) {
		LOGGER.error("API request failed", err);
		return {
			status: 500,
			message: "Failed to connect to server",
		} as T;
	}
}