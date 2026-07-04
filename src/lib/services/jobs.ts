import { auth } from "$lib/auth/auth.svelte";
import { API_URL } from "$lib/const";
import { LOGGER } from "$lib/logger";
import { type Job, type APIResponse, type ValidationErrors, type JobExecution } from "$lib/types";
import { fetchAPI } from "$lib/utils";

export async function loadJobs(): Promise<APIResponse<Job[]>> {
    LOGGER.debug("Loading all jobs");
    return fetchAPI<APIResponse<Job[]>>(`${API_URL}/jobs`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.auth_token}`,
        }
    });
}

export async function loadJobById(jobId: number): Promise<APIResponse<Job>> {
    LOGGER.debug("Loading job details by id", jobId);
    return fetchAPI<APIResponse<Job>>(`${API_URL}/jobs/${jobId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.auth_token}`,
        }
    });
}

export async function triggerJob(jobId: number): Promise<APIResponse<undefined>> {
    LOGGER.debug("Triggering job", jobId);
    return fetchAPI<APIResponse<undefined>>(`${API_URL}/jobs/${jobId}/run`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.auth_token}`,
        }
    });
}

export async function loadJobExecutions(jobId: number): Promise<APIResponse<JobExecution[]>> {
    LOGGER.debug("Loading job executions", jobId);
    return fetchAPI<APIResponse<JobExecution[]>>(`${API_URL}/jobs/${jobId}/executions`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.auth_token}`,
        }
    });
}

export async function deleteJobById(jobId: number): Promise<APIResponse<undefined>> {
    LOGGER.debug("Deleting job by id", jobId);
    return fetchAPI<APIResponse<undefined>>(`${API_URL}/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.auth_token}`,
        }
    });
}

export type CreateJobRequest = APIResponse & Omit<Job, 'id' | 'created_at' | 'updated_at' | 'last_execution'>;
export type CreateJobResponse = APIResponse<Job | ValidationErrors>

export async function createJob(data: CreateJobRequest): Promise<CreateJobResponse> {
    LOGGER.info(`Creating new job`);
    return fetchAPI<CreateJobResponse>(`${API_URL}/jobs/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}

export type UpdateJobRequest = APIResponse & Omit<Job, 'id' | 'created_at' | 'updated_at' | 'last_execution'>;
export type UpdateJobResponse = APIResponse<Job | ValidationErrors>

export async function updateJob(jobId: number, data: UpdateJobRequest): Promise<UpdateJobResponse> {
    LOGGER.info(`Updating existing job`);
    return fetchAPI<UpdateJobResponse>(`${API_URL}/jobs/${jobId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}
