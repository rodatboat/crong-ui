<script lang="ts">
    import { auth } from "$lib/auth/auth.svelte";
    import JobList from "$lib/components/job-list.svelte";
    import { loadJobsByFolder } from "$lib/services/folders";
    import type { Folder, Job } from "$lib/types";
    import { page } from "$app/state";


    const folderId = $derived(page.params.folderId);
    let jobs = $state<Job[]>([]);
    let folder = $state<Folder | null>(null);
    let loading = $state<boolean>(true);

    $effect(() => {
        if (!folderId) return;
        const folderIdNum = Number(folderId);
        if (isNaN(folderIdNum)) return;
        if (!auth.auth_token) return;
        loadJobsByFolder(folderIdNum).then((response) => {
            const { data } = response;
            if (!data || !Array.isArray(data.jobs)) return;
            const { jobs: jobsArray, ...folderData } = data;
            jobs = jobsArray;
            folder = folderData as Folder;
            loading = false;
        });
    });
</script>

<section class="gap-6 pb-8 pt-6 px-6 md:px-8">
    <h1 class="text-2xl">Jobs ({folder?.name})</h1>
    <JobList {jobs} {loading} />
</section>
