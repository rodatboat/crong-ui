<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import * as Select from "$lib/components/ui/select";
    import JobHeadersInput from "$lib/components/job-headers.svelte";
    import {
        createJob,
        updateJob,
        type CreateJobRequest,
        type CreateJobResponse,
        type UpdateJobRequest,
        type UpdateJobResponse,
    } from "$lib/services/jobs";
    import {
        type APIResponse,
        type Job,
        type ValidationErrors,
        type JobAuth,
        type JobHeaders,
    } from "$lib/types";
    import { jobSchema } from "$lib/services/JobValidationSchemas";
    import { LOGGER } from "$lib/logger";
    import { validateForm } from "$lib/utils";
    import { page } from "$app/state";
    import { auth } from "$lib/auth/auth.svelte";
    import { activeJob } from "$lib/states/job.svelte";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import JobRunButton from "$lib/components/job-run-button.svelte";
    import { JOB_METHOD_MAP } from "$lib/const";
    import { Separator } from "$lib/components/ui/separator";
    import LoaderIcon from "@lucide/svelte/icons/loader-circle";
    import { folders } from "$lib/states/folders.svelte";

    type JobForm = {
        title: string;
        url: string;
        folder_id?: number;

        method: number;
        headers: JobHeaders[];
        auth: JobAuth;
        body: string;
        cron: string;

        timezone: string;
        timeout: number;
        enabled: boolean;
    };

    let formData = $state<JobForm>({
        title: "",
        url: "",
        folder_id: undefined,

        headers: [],
        auth: { enabled: false, username: "", password: "" },
        method: 0,
        body: "",
        cron: "",

        timezone: "UTC",
        timeout: 30,
        enabled: true,
    });

    let loading = $state(false);
    let validationErrors = $state<ValidationErrors>({});
    let error = $state<string | undefined>("");
    let initialized = $state(false);

    let selectedFolder = $state<string | undefined>(undefined);
    let selectedMethod = $state<string>("0");

    const jobId = $derived(page.params.jobId);
    const jobIdNum = $derived(Number(jobId));
    const isUpdateForm: boolean = $derived(!isNaN(jobIdNum));

    async function loadDefaultForm() {
        if (!jobIdNum || initialized) return;
        if (!isUpdateForm || !activeJob.initialized) return;

        loading = true;

        if (activeJob.job) {
            const job = activeJob.job;

            formData = {
                title: job.title,
                url: job.url,
                folder_id: job.folder_id,
                method: job.method,

                body: job.body ?? "",
                cron: job.cron,
                headers: job.headers ?? [],
                auth: job.auth ?? {
                    enabled: false,
                    username: "",
                    password: "",
                },

                timezone: job.timezone ?? "UTC",
                timeout: job.timeout ?? 30,
                enabled: job.enabled ?? true,
            };

            if (job.folder_id) selectedFolder = String(job.folder_id);
            selectedMethod = String(job.method);

            initialized = true;
        } else {
            goto(resolve("/jobs"));
        }

        loading = false;
    }

    async function handleCreateJob() {
        loading = true;

        validationErrors = validateForm(jobSchema, formData);
        if (Object.keys(validationErrors).length > 0) {
            LOGGER.error("Validation error", validationErrors);
            loading = false;
            return;
        }

        const resp: APIResponse<CreateJobResponse> = await createJob(
            formData as CreateJobRequest,
        );
        if (resp.status == 200) {
            error = undefined;
            const jobCreated: Job = resp.data as Job;
            goto(resolve(`/jobs/${jobCreated.id}`));
        } else {
            error = resp.message;
        }
        loading = false;
    }

    async function handleUpdateJob() {
        loading = true;

        validationErrors = validateForm(jobSchema, formData);
        if (Object.keys(validationErrors).length > 0) {
            LOGGER.error("Validation error", Object.entries(validationErrors));
            loading = false;
            return;
        }

        const resp: APIResponse<UpdateJobResponse> = await updateJob(
            jobIdNum,
            formData as UpdateJobRequest,
        );
        if (resp.status == 200) {
            error = undefined;
        } else if (resp.status == 400) {
            if (resp.data) validationErrors = resp.data as ValidationErrors;
            error = resp.message;
        } else {
            error = resp.message;
        }
        loading = false;
    }

    $effect(() => {
        if (!auth.initialized) return;
        // If there's a jobId, but we can't find the job.
        // isUpdateForm (bool) will be false since it can't find the job to update.
        if (jobId) {
            if (!isUpdateForm) goto(resolve("/jobs"));
            else loadDefaultForm();
        } else {
            initialized = true;
        }
    });

    $effect(() => {
        formData.method = Number(selectedMethod);
    });

    $effect(() => {
        if (!selectedFolder || selectedFolder === "")
            formData.folder_id = undefined;
        else formData.folder_id = Number(selectedFolder);
    });
</script>

<Card.Root class="max-w-lg mx-auto">
    <Card.Header>
        <Card.Title>{isUpdateForm ? "Update" : "Create"} Job</Card.Title>
        <Card.Description
            >{isUpdateForm ? "Update an existing" : "Create a new"} scheduled job</Card.Description
        >
    </Card.Header>

    {#if !initialized}
        <div
            class="flex gap-2 items-center justify-center h-full min-h-175"
        >
            <LoaderIcon class="animate-spin text-accent" />
        </div>
    {:else}
        <Card.Content class="space-y-4">
            <div class="space-y-2">
                <Label for="title">Job Title</Label>
                <Input
                    id="title"
                    type="text"
                    placeholder="Enter job title"
                    bind:value={formData.title}
                    required
                />
                {#if validationErrors.title}
                    <p class="text-destructive text-xs">
                        {validationErrors.title}
                    </p>
                {/if}
            </div>

            <div class="space-y-2">
                <Label for="url">URL</Label>
                <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/api"
                    bind:value={formData.url}
                    required
                />
                {#if validationErrors.url}
                    <p class="text-destructive text-xs">
                        {validationErrors.url}
                    </p>
                {/if}
            </div>

            <div class="space-y-2">
                <Label for="folder_id">Folder (Optional)</Label>
                <Select.Root name="folder_id" type="single" bind:value={selectedFolder}>
                    <Select.Trigger class="w-full">
                        {formData.folder_id
                            ? (folders.folders.get(formData.folder_id)?.name ?? "Select folder")
                            : "No folder"}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="">No folder</Select.Item>
                        {#each folders.folders.keys() as folderId (folderId)}
                            <Select.Item value={String(folderId)}
                                >{folders.folders.get(folderId)?.name}</Select.Item
                            >
                        {/each}
                    </Select.Content>
                </Select.Root>
                {#if validationErrors.folder_id}
                    <p class="text-destructive text-xs">
                        {validationErrors.folder_id}
                    </p>
                {/if}
            </div>

            <div class="space-y-2">
                <Label for="method">HTTP Method</Label>
                <Select.Root name="method" type="single" bind:value={selectedMethod}>
                    <Select.Trigger class="w-full">
                        {JOB_METHOD_MAP.get(formData.method) ?? "Select method"}
                    </Select.Trigger>
                    <Select.Content>
                        {#each Array.from(JOB_METHOD_MAP.entries()) as [key, value] (key)}
                            <Select.Item value={String(key)}
                                >{value}</Select.Item
                            >
                        {/each}
                    </Select.Content>
                </Select.Root>
                {#if validationErrors.method}
                    <p class="text-destructive text-xs">
                        {validationErrors.method}
                    </p>
                {/if}
            </div>

            <div class="space-y-2">
                <Label for="cron">Cron Expression</Label>
                <Input
                    id="cron"
                    type="text"
                    placeholder="0 0 * * * (every hour)"
                    bind:value={formData.cron}
                    required
                />
                {#if validationErrors.cron}
                    <p class="text-destructive text-xs">
                        {validationErrors.cron}
                    </p>
                {/if}
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <Label for="timeout">Timeout (seconds)</Label>
                    <Input
                        id="timeout"
                        type="number"
                        placeholder="15"
                        bind:value={formData.timeout}
                        min="1"
                        max="30"
                        required
                    />
                    {#if validationErrors.timeout}
                        <p class="text-destructive text-xs">
                            {validationErrors.timeout}
                        </p>
                    {/if}
                </div>

                <div class="space-y-2 flex items-center gap-2 mt-5">
                    <input
                        id="enabled"
                        type="checkbox"
                        class="my-auto"
                        bind:checked={formData.enabled}
                    />
                    <Label for="enabled">Enabled</Label>
                </div>
            </div>

            <Separator class="my-4" />
            <Card.Header class="px-0">
                <Card.Title>Advanced</Card.Title>
                <Card.Description>Advanced options</Card.Description>
            </Card.Header>

            <div class="space-y-2">
                <Label for="headers">Headers</Label>
                <JobHeadersInput bind:headers={formData.headers} />
                {#if validationErrors.headers}
                    <p class="text-destructive text-xs">
                        {validationErrors.headers}
                    </p>
                {/if}
            </div>

            <div class="space-y-2">
                <Label for="auth">HTTP Authentication</Label>
                <Input
                    id="auth.username"
                    type="text"
                    name="auth.username"
                    placeholder="Username"
                    bind:value={formData.auth.username}
                    disabled={!formData.auth.enabled}
                />

                <Input
                    id="auth.password"
                    type="password"
                    name="auth.password"
                    placeholder="Password"
                    bind:value={formData.auth.password}
                    disabled={!formData.auth.enabled}
                />
                {#if validationErrors.headers}
                    <p class="text-destructive text-xs">
                        {validationErrors.headers}
                    </p>
                {/if}

                <div class="flex items-center justify-end gap-2">
                    <input
                        id="auth.enabled"
                        type="checkbox"
                        class="my-auto"
                        bind:checked={formData.auth.enabled}
                    />
                    <Label for="auth.enabled">Enabled</Label>
                </div>
            </div>

            <div class="space-y-2">
                <Label for="body">Request Body</Label>
                <textarea
                    id="body"
                    class="w-full min-h-24 px-3 py-2 border border-input rounded-md text-xs"
                    placeholder={`{ "action": "test" }`}
                    bind:value={formData.body}
                ></textarea>
                {#if validationErrors.body}
                    <p class="text-destructive text-xs">
                        {validationErrors.body}
                    </p>
                {/if}
            </div>

            <div class="space-y-2">
                <Label for="timezone">Timezone</Label>
                <Input
                    id="timezone"
                    type="text"
                    placeholder="UTC"
                    bind:value={formData.timezone}
                    required
                />
                {#if validationErrors.timezone}
                    <p class="text-destructive text-xs">
                        {validationErrors.timezone}
                    </p>
                {/if}
            </div>

            {#if error}
                <p class="text-destructive text-xs">{error}</p>
            {/if}
        </Card.Content>
    {/if}

    <Card.Footer>
        <div class="flex flex-row w-full gap-2 text-center">
            <Button
                class="w-[80%] hover:cursor-pointer"
                disabled={loading}
                onclick={isUpdateForm ? handleUpdateJob : handleCreateJob}
            >
                {loading
                    ? "Creating..."
                    : isUpdateForm
                      ? "Update Job"
                      : "Create Job"}
            </Button>
            {#if isUpdateForm && jobIdNum}
                <JobRunButton jobId={jobIdNum} class="w-[20%]" />
            {/if}
        </div>
    </Card.Footer>
</Card.Root>
