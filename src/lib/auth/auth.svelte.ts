import { goto } from "$app/navigation";
import { AUTH_TOKEN_KEY } from "$lib/const";
import { loadAuthedUser } from "$lib/services/auth";
import type { APIResponse, User } from "$lib/types";

class AuthState {
    auth_token = $state<string | null>(null);
    user = $state<User | null>(null);

    async initialize() {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
            const resp: APIResponse<User> = await loadAuthedUser(token);
            if (resp.status == 200 && resp.data) {
                this.authenticate(token, resp.data);
            } else {
                this.deauth();
                goto("/login");
            }
        }
    }

    authenticate(auth_token: string, user: User) {
        this.auth_token = auth_token;
        this.user = user;
        localStorage.setItem(AUTH_TOKEN_KEY, auth_token);
    }

    deauth() {
        this.auth_token = null;
        this.user = null;
        localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    get isAuthed() {
        return this.auth_token !== null;
    }
}

export const auth = new AuthState();