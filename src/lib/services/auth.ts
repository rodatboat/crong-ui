import { API_URL } from "$lib/const";
import type { APIResponse, User, ValidationErrors } from "$lib/types";

export type LoginRequest = APIResponse & {
    email: string;
    password: string;
};

export type LoginResponse = APIResponse<User | ValidationErrors> & {
    auth_token?: string;
};

export async function login(data: LoginRequest): Promise<LoginResponse> {
    const resp = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    return resp.json().catch(() => {
        return {
            status: 500,
            message: "Failed to parse response",
        };
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
    const resp = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    return resp.json().catch(() => {
        return {
            status: 500,
            message: "Failed to parse response",
        };
    });
}