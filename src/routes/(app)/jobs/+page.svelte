<script lang="ts">
    import { auth } from "$lib/auth/auth.svelte";
    import JobList from "$lib/components/job-list.svelte";
    import { loadJobs } from "$lib/services/jobs";
    import type { Job } from "$lib/types";

    let jobs = $state<Job[]>([]);

    $effect(() => {
        if (!auth.auth_token) return;
        loadJobs().then(({ data }) => {
            if (!data) return;
            jobs = data;
        });
    });
</script>

<section class="gap-6 pb-8 pt-6 px-6 md:px-8">
    <h1 class="text-2xl w-min">Jobs</h1>
    <JobList {jobs} />
</section>
