import { Job } from "./server";
import express from 'express';

export const broadcast = (
    jobId: string, 
    msg: {
        progress: number, 
        status: string,
        result?: string
    }, 
    job: Map<string, Job>
) => {
    const currentJob = job.get(jobId);
    const payload = JSON.stringify(msg);
    if (currentJob) {
        currentJob.client?.write(`data: ${payload}\n\n`);
    }
}