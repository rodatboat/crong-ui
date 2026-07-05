<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import {
        login,
        type LoginRequest,
        type LoginResponse,
    } from "$lib/services/auth";
    import { auth } from "$lib/auth/auth.svelte";
    import { type APIResponse, type User, type ValidationErrors } from "$lib/types";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { loginSchema } from "$lib/auth/AuthValidationSchemas";
    import { LOGGER } from "$lib/logger";
    import { validateForm } from "$lib/utils";

    let email = $state("");
    let password = $state("");
    let loading = $state(false);
    let validationErrors = $state<ValidationErrors>({});
    let error = $state<string | undefined>("");

    async function handleLogin() {
        loading = true;
        let reqData: LoginRequest = { email, password };
        
        validationErrors = validateForm(loginSchema, reqData);
        if (Object.keys(validationErrors).length > 0) {
            LOGGER.error("Validation error", Object.entries(validationErrors));
            loading = false;
            return;
        }

        const resp: APIResponse<LoginResponse> = await login(reqData);
        if (resp.status == 200) {
            error = undefined;
            if (resp.data?.auth_token && resp.data) {
                auth.authenticate(resp.data.auth_token, resp.data as User);
                goto(resolve("/"));
            }
        } else {
            error = resp.message;
        }
        loading = false;
        return;
    }
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Login</Card.Title>
        <Card.Description>Sign in to your account</Card.Description>
    </Card.Header>

    <Card.Content class="space-y-4 min-w-xs">
        <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                bind:value={email}
                required
            />
            {#if validationErrors.email}
                <p class="text-destructive text-xs">{validationErrors.email}</p>
            {/if}
        </div>

        <div class="space-y-2">
            <Label for="password">Password</Label>

            <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                bind:value={password}
                required
            />
            {#if validationErrors.password}
                <p class="text-destructive text-xs">{validationErrors.password}</p>
            {/if}
        </div>

        {#if error}
            <p class="text-destructive text-xs">{error}</p>
        {/if}
    </Card.Content>

    <Card.Footer>
        <div class="flex flex-col w-full space-y-4 text-center">
            <Button class="w-full hover:cursor-pointer" disabled={loading} onclick={handleLogin}>
                {loading ? "Signing In..." : "Login"}
            </Button>
            <a href={resolve("/register")}>Don't have an account?</a>
        </div>
    </Card.Footer>
</Card.Root>
