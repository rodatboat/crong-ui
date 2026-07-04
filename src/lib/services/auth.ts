
import { auth } from "$lib/auth/auth.svelte";
import { API_URL } from "$lib/const";
import { LOGGER } from "$lib/logger";
import type { APIResponse, User, ValidationErrors } from "$lib/types";
import { fetchAPI } from "$lib/utils";

export type LoginRequest = APIResponse & {
    email: string;
    password: string;
};

export type LoginResponse = APIResponse<User & { auth_token?: string }> | APIResponse<ValidationErrors>;

export async function login(data: LoginRequest): Promise<LoginResponse> {
    LOGGER.info(`Login attempt for ${data.email}`);
    return fetchAPI<LoginResponse>(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export type RegisterRequest = APIResponse & {
    first_name: string;
    last_name?: string;
    email: string;
    password: string;
};

export type RegisterResponse = APIResponse<User | ValidationErrors>

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
    LOGGER.info(`Register attempt for ${data.email}`);
    return fetchAPI<RegisterResponse>(`${API_URL}/users/register`, {
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