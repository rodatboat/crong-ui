
import { auth } from "$lib/auth/auth.svelte";
import { API_URL } from "$lib/const";
import { LOGGER } from "$lib/logger";
import type { APIResponse, User, ValidationErrors } from "$lib/types";
import { fetchAPI } from "$lib/utils";

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = User & { auth_token?: string } | ValidationErrors;

export async function login(data: LoginRequest): Promise<APIResponse<LoginResponse>> {
    LOGGER.info(`Login attempt for ${data.email}`);
    return fetchAPI<APIResponse<LoginResponse>>(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export type RegisterRequest = {
    first_name: string;
    last_name?: string;
    email: string;
    password: string;
};

export type RegisterResponse = User | ValidationErrors;

export async function register(data: RegisterRequest): Promise<APIResponse<RegisterResponse>> {
    LOGGER.info(`Register attempt for ${data.email}`);
    return fetchAPI<APIResponse<RegisterResponse>>(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export async function loadAuthedUser(tokenOverride?: string): Promise<APIResponse<User>> {
    LOGGER.debug("Loading authenticated user");
    return fetchAPI<APIResponse<User>>(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenOverride || auth.auth_token}`,
        }
    });
}