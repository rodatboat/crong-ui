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
    import { type User } from "$lib/types";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";

    let email = $state("");
    let password = $state("");
    let loading = $state(false);
    let error = $state<string | undefined>("");

    async function handleLogin() {
        loading = true;
        let reqData: LoginRequest = {
            email,
            password,
        };
        const resp: LoginResponse = await login(reqData);
        if (resp.status == 200) {
            error = undefined;
            if (!resp.data?.auth_token) return;
            if (!resp.data) return;
            auth.authenticate(resp.data.auth_token, resp.data as User);
            goto("/");
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
        </div>

        {#if error}
            <p class="text-destructive text-sm">{error}</p>
        {/if}
    </Card.Content>

    <Card.Footer>
        <div class="flex flex-col w-full space-y-4 text-center">
            <Button class="w-full" disabled={loading} onclick={handleLogin}>
                {loading ? "Signing In..." : "Login"}
            </Button>
            <a href={resolve("/register")}>Don't have an account?</a>
        </div>
    </Card.Footer>
</Card.Root>
