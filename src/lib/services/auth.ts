
import { auth } from "$lib/auth/auth.svelte";
import { API_URL } from "$lib/const";
import { LOGGER } from "$lib/logger";
import type { APIResponse, User, ValidationErrors } from "$lib/types";

export type LoginRequest = APIResponse & {
    email: string;
    password: string;
};

export type LoginResponse = APIResponse<User & { auth_token?: string }> | APIResponse<ValidationErrors>;

export async function login(data: LoginRequest): Promise<LoginResponse> {
    LOGGER.info(`Login attempt for ${data.email}`);
    const resp = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    return resp.json().catch(() => {
        LOGGER.info("Login response parse failed");
        return {
            status: 500,
            message: "Failed to parse response",
        };
    }).then(result => {
        LOGGER.info(`Login response: status ${result.status}`);
        return result;
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
    const resp = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    return resp.json().catch(() => {
        LOGGER.info("Register response parse failed");
        return {
            status: 500,
            message: "Failed to parse response",
        };
    }).then(result => {
        LOGGER.info(`Register response: status ${result.status}`);
        return result;
    });
}

export async function loadAuthedUser(tokenOverride?: string): Promise<APIResponse<User>> {
    LOGGER.debug("Loading authenticated user");
    const resp = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenOverride || auth.auth_token}`,
        }
    });
    
    return resp.json().catch(() => {
        LOGGER.info("Load user response parse failed");
        return {
            status: 500,
            message: "Failed to parse response",
        };
    }).then(result => {
        LOGGER.debug(`Load user response: status ${result.status}`);
        return result;
    });
}