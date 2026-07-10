<script lang="ts">
    import { auth } from "$lib/auth/auth.svelte";
    import JobList from "$lib/components/job-list.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import ClockPlusIcon from "@lucide/svelte/icons/clock-plus";
    import { loadJobs } from "$lib/services/jobs";
    import type { Job } from "$lib/types";

    let jobs = $state<Job[]>([]);
    let loading = $state<boolean>(true);

    $effect(() => {
        if (!auth.auth_token) return;
        loadJobs().then(({ data }) => {
            if (!data) return;
            jobs = data;
            loading = false;
        });
    });
</script>

<section class="gap-6 pb-8 pt-6 px-6 md:px-8">
    <div class="flex items-center gap-6">
        <h1 class="text-2xl">Jobs</h1>
        <Button
            class="w-min hover:cursor-pointer order-2"
            href="/jobs/new"><ClockPlusIcon class="size-3" /> New job</Button>
    </div>
    <JobList {jobs} {loading} />
</section>
