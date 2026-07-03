import { goto } from "$app/navigation";
import { AUTH_TOKEN_KEY } from "$lib/const";
import { LOGGER } from "$lib/logger";
import { loadAuthedUser } from "$lib/services/auth";
import type { APIResponse, User } from "$lib/types";

class AuthState {
    auth_token = $state<string | null>(null);
    user = $state<User | null>(null);

    async initialize() {
        LOGGER.debug("Auth initialize");
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
            if (this.user) {
                LOGGER.debug("User already authenticated");
                return;
            }
            LOGGER.debug("Token found in storage, validating...", token, this.auth_token);
            const resp: APIResponse<User> = await loadAuthedUser(token);
            if (resp.status == 200 && resp.data) {
                LOGGER.info("Token valid, authenticating");
                this.authenticate(token, resp.data);
            } else {
                LOGGER.info("Token invalid, clearing auth");
                this.deauth();
                goto("/login");
            }
        } else LOGGER.warn("No token found in storage");
    }

    authenticate(auth_token: string, user: User) {
        LOGGER.info(`User authenticated: ${user.email}`);
        this.auth_token = auth_token;
        this.user = user;
        localStorage.setItem(AUTH_TOKEN_KEY, auth_token);
    }

    deauth() {
        LOGGER.info("User deauthenticated");
        this.auth_token = null;
        this.user = null;
        localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    get isAuthed() {
        return this.auth_token !== null;
    }
}

export const auth = new AuthState();