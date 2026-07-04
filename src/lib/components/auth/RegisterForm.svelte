<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import {
        register,
        type RegisterRequest,
        type RegisterResponse,
    } from "$lib/services/auth";
    import { type ValidationErrors } from "$lib/types";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { registerSchema } from "$lib/auth/AuthValidationSchemas";
    import { LOGGER } from "$lib/logger";
    import { validateForm } from "$lib/utils";

    let firstName = $state("");
    let lastName = $state("");
    let email = $state("");
    let password = $state("");
    let confirmPassword = $state("");
    let loading = $state(false);
    let validationErrors = $state<ValidationErrors>({});
    let error = $state<string | undefined>("");

    async function handleResiger() {
        loading = true;
        let formData = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            confirm_password: confirmPassword,
        };
        
        validationErrors = validateForm(registerSchema, formData);
        if (!validationErrors) {
            LOGGER.error("Validation error", Object.entries(validationErrors));
            loading = false;
            return;
        }

        let reqData: RegisterRequest = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
        };
        const resp: RegisterResponse = await register(reqData);
        if (resp.status == 200) {
            error = undefined;
            goto(resolve("/login"));
        } else {
            error = resp.message;
        }
        loading = false;
    }
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>Regsiter</Card.Title>
        <Card.Description>Create a new account</Card.Description>
    </Card.Header>

    <Card.Content class="space-y-4 min-w-xs">
        <div class="flex flex-row space-x-4">
            <div class="space-y-2">
                <Label for="first_name">First Name</Label>
                <Input
                    id="first_name"
                    type="text"
                    placeholder="Enter your first name"
                    bind:value={firstName}
                    required
                />
                {#if validationErrors.first_name}
                    <p class="text-destructive text-xs">{validationErrors.first_name}</p>
                {/if}
            </div>
            <div class="space-y-2">
                <Label for="last_name">Last Name</Label>
                <Input
                    id="last_name"
                    type="text"
                    placeholder="Enter your last name"
                    bind:value={lastName}
                />
                {#if validationErrors.last_name}
                    <p class="text-destructive text-xs">{validationErrors.last_name}</p>
                {/if}
            </div>
        </div>

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

        <div class="space-y-2">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                bind:value={confirmPassword}
                required
            />
            {#if validationErrors.confirm_password}
                <p class="text-destructive text-xs">{validationErrors.confirm_password}</p>
            {/if}
        </div>

        {#if error}
            <p class="text-destructive text-xs">{error}</p>
        {/if}
    </Card.Content>

    <Card.Footer>
        <div class="flex flex-col w-full space-y-4 text-center">
            <Button class="w-full" disabled={loading} onclick={handleResiger}>
                {loading ? "Registering..." : "Register"}
            </Button>
            <a href={resolve("/login")}>Already have an account?</a>
        </div>
    </Card.Footer>
</Card.Root>
