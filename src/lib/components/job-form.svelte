<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import * as Select from "$lib/components/ui/select";
    import {
        createJob,
        loadJobById,
        updateJob,
        type CreateJobRequest,
        type CreateJobResponse,
        type UpdateJobRequest,
        type UpdateJobResponse,
    } from "$lib/services/jobs";
    import { loadFolders } from "$lib/services/folders";
    import {
        type APIResponse,
        type Job,
        type Folder,
        type ValidationErrors,
    } from "$lib/types";
    import { jobSchema } from "$lib/services/JobValidationSchemas";
    import { LOGGER } from "$lib/logger";
    import { validateForm } from "$lib/utils";
    import { page } from "$app/state";
    import { auth } from "$lib/auth/auth.svelte";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import JobRunButton from "$lib/components/job-run-button.svelte";
    import { JOB_METHOD_MAP } from "$lib/const";
    import { Separator } from "$lib/components/ui/separator";
    import LoaderIcon from "@lucide/svelte/icons/loader-circle";


    let title = $state("");
    let url = $state("");
    let selectedFolder = $state<string | undefined>(undefined);
    let selectedMethod = $state("0");
    let body = $state("");
    let cron = $state("");
    let timezone = $state("UTC");
    let timeout = $state(30);
    let enabled = $state(true);
    let loading = $state(false);
    let validationErrors = $state<ValidationErrors>({});
    let error = $state<string | undefined>("");
    let initialized = $state(false);
    let folders = $state<Folder[]>([]);

    const folderId = $derived(
        selectedFolder ? Number(selectedFolder) : undefined,
    );
    const method = $derived(Number(selectedMethod));

    const jobId = $derived(page.params.jobId);
    const jobIdNum = $derived(Number(jobId));
    const isUpdateForm: boolean = $derived(!isNaN(jobIdNum));

    async function loadDefaultForm() {
        if (!jobId || initialized) return;
        if (!isUpdateForm) return;

        loading = true;

        const resp: APIResponse<Job> = await loadJobById(jobIdNum);

        if (resp.status === 200 && resp.data) {
            const job = resp.data;

            title = job.title;
            url = job.url;
            selectedFolder = job.folder_id ? String(job.folder_id) : undefined;
            selectedMethod = String(job.method);
            body = job.body ?? "";
            cron = job.cron;
            // TODO: Load headers
            // TODO: Load auth
            timezone = job.timezone ?? "UTC";
            timeout = job.timeout ?? 30;
            enabled = job.enabled ?? true;

            initialized = true;
        } else if (resp.status === 404) {
            goto(resolve("/jobs"));
        } else {
            error = resp.message;
        }

        loading = false;
    }

    async function handleCreateJob() {
        loading = true;
        let formData: CreateJobRequest = {
            title,
            url,
            folder_id: folderId,
            method,
            body,
            cron,
            timezone,
            timeout,
            enabled,
            headers: [],
            auth: { enabled: false, username: "", password: "" },
        };

        validationErrors = validateForm(jobSchema, formData);
        if (Object.keys(validationErrors).length > 0) {
            LOGGER.error("Validation error", Object.entries(validationErrors));
            loading = false;
            return;
        }

        const resp: APIResponse<CreateJobResponse> = await createJob(formData);
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
        let formData = {
            title,
            url,
            folder_id: folderId,
            method,
            body,
            cron,
            timezone,
            timeout,
            enabled,
            headers: [], // TODO: Finish
            auth: { enabled: false, username: "", password: "" }, // TODO: Finish
        };

        validationErrors = validateForm(jobSchema, formData);
        if (Object.keys(validationErrors).length > 0) {
            LOGGER.error("Validation error", Object.entries(validationErrors));
            loading = false;
            return;
        }

        let reqData: UpdateJobRequest = {
            title,
            url,
            folder_id: folderId,
            method,
            body,
            cron,
            timezone,
            timeout,
            enabled,
            headers: [], // TODO: Finish
            auth: { enabled: false, username: "", password: "" }, // TODO: Finish
        };
        const resp: APIResponse<UpdateJobResponse> = await updateJob(
            jobIdNum,
            reqData,
        );
        if (resp.status == 200) {
            error = undefined;
        } else {
            error = resp.message;
        }
        loading = false;
    }

    $effect(() => {
        if (!auth.auth_token) return;

        // If there's a jobId, but we can't find the job. 
        // isUpdateForm (bool) will be false since it can't find the job to update.
        if (jobId && !isUpdateForm) {
            goto(resolve("/jobs"));
        }

        // Load folders on init
        if (folders.length === 0) {
            loadFolders().then((resp) => {
                if (resp.status === 200 && resp.data) {
                    folders = resp.data;
                } else {
                    LOGGER.error("Failed to load folders", resp.message);
                }
            });
        }

        if (jobId && isUpdateForm) {
            loadDefaultForm();
        }
    });
</script>

<Card.Root>
    <Card.Header>
        <Card.Title>{isUpdateForm ? "Update" : "Create"} Job</Card.Title>
        <Card.Description
            >{isUpdateForm ? "Update an existing" : "Create a new"} scheduled job</Card.Description
        >
    </Card.Header>

    {#if !initialized}
    <div class="flex gap-2 items-center justify-center h-full min-h-175 md:min-w-xl">
        <LoaderIcon class="animate-spin text-accent" />
    </div>
    {:else}
    <Card.Content class="space-y-4 md:min-w-xl">
        <div class="space-y-2">
            <Label for="title">Job Title</Label>
            <Input
                id="title"
                type="text"
                placeholder="Enter job title"
                bind:value={title}
                required
            />
            {#if validationErrors.title}
                <p class="text-destructive text-xs">{validationErrors.title}</p>
            {/if}
        </div>

        <div class="space-y-2">
            <Label for="url">URL</Label>
            <Input
                id="url"
                type="url"
                placeholder="https://example.com/api"
                bind:value={url}
                required
            />
            {#if validationErrors.url}
                <p class="text-destructive text-xs">{validationErrors.url}</p>
            {/if}
        </div>

        <div class="space-y-2">
            <Label for="folderId">Folder (Optional)</Label>
            <Select.Root type="single" bind:value={selectedFolder}>
                <Select.Trigger class="w-full">
                    {folderId
                        ? (folders.find((f) => f.id === folderId)?.name ??
                          "Select folder")
                        : "No folder"}
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="">No folder</Select.Item>
                    {#each folders as folder (folder.id)}
                        <Select.Item value={String(folder.id)}
                            >{folder.name}</Select.Item
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
            <Select.Root type="single" bind:value={selectedMethod}>
                <Select.Trigger class="w-full">
                    {JOB_METHOD_MAP.get(method) ?? "Select method"}
                </Select.Trigger>
                <Select.Content>
                    {#each Array.from(JOB_METHOD_MAP.entries()) as [key, value] (key)}
                        <Select.Item value={String(key)}>{value}</Select.Item>
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
                bind:value={cron}
                required
            />
            {#if validationErrors.cron}
                <p class="text-destructive text-xs">{validationErrors.cron}</p>
            {/if}
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
                <Label for="timeout">Timeout (seconds)</Label>
                <Input
                    id="timeout"
                    type="number"
                    placeholder="15"
                    bind:value={timeout}
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
                    bind:checked={enabled}
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
            <Label for="body">Request Body (JSON)</Label>
            <textarea
                id="body"
                class="w-full min-h-24 px-3 py-2 border border-input rounded-md"
                placeholder={`{ "action": "test" }`}
                bind:value={body}
            ></textarea>
            {#if validationErrors.body}
                <p class="text-destructive text-xs">{validationErrors.body}</p>
            {/if}
        </div>

        <div class="space-y-2">
            <Label for="timezone">Timezone</Label>
            <Input
                id="timezone"
                type="text"
                placeholder="UTC"
                bind:value={timezone}
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
