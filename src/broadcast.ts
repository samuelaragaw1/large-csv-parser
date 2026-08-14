import { Job } from "./server";
import express from 'express';

export const broadcast = (
    jobId: string, 
    msg: {
        progress: number, 
        status: string
    }, 
    job: Map<string, Job>,
    res: express.Response
) => {
    if (job.has(jobId)) {
        const currentJob = job.get(jobId);
        const payload = JSON.stringify(msg);
        if (currentJob) {
            currentJob.client?.write(`data: ${payload}`);
        }
    }
}