import { Request, Response } from "express";
import { Job } from "./server";

export const SSEHandler = (req: Request, 
    res: Response, 
    job: Map<string, Job>,
    jobId: string
) => {
    if (job.has(jobId)) {
        const currentJob: 
            Job | 
            undefined |
            null
            = job.get(jobId);
        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
        })
        res.flushHeaders();
        if (currentJob) {
            currentJob.client = res;
        }
        res.on('close', () => {
            if (currentJob) {
                currentJob.client = null;
            }
        })
    }
}