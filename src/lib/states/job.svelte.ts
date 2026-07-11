import { LOGGER } from "$lib/logger";
import type { APIResponse, Job } from "$lib/types";
import { auth } from "$lib/auth/auth.svelte";
import { loadJobById } from "$lib/services/jobs";

class ActiveJobState {
    job = $state<Job | null>(null);
    initialized = $state(false);

    async initialize(jobId: number) {
        if (!auth.initialized) {
            LOGGER.warn("Auth not initialized, skipping active job initialization");
            return;
        }

        LOGGER.debug("Loading user job");
        const resp: APIResponse<Job> = await loadJobById(jobId);
        
        if (resp.status === 200 && resp.data) {
            LOGGER.info("Job loaded successfully");
            this.job = resp.data;
        } else {
            LOGGER.error("Failed to load job", resp.message);
            this.job = null;
        }
        
        this.initialized = true;
    }
}

export const activeJob = new ActiveJobState();