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

    let firstName = $state("");
    let lastName = $state("");
    let email = $state("");
    let password = $state("");
    let loading = $state(false);
    let error = $state<string | undefined>("");

    async function handleResiger() {
        let reqData: RegisterRequest = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
        };
        const resp: RegisterResponse = await register(reqData);
        if (resp.status != 200) {
            error = resp.message;
            return;
        } else {
            error = undefined;
            // TODO: Start a session...
            // window.location.href = "/";
        }
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
            </div>
            <div class="space-y-2">
                <Label for="last_name">Last Name</Label>
                <Input
                    id="last_name"
                    type="text"
                    placeholder="Enter your last name"
                    bind:value={email}
                />
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
        <Button class="w-full" disabled={loading} onclick={handleResiger}>
            {loading ? "Registering..." : "Register"}
        </Button>
    </Card.Footer>
</Card.Root>
