import { Worker } from "node:worker_threads";
import { Job } from "./server";
import { Request, Response } from "express";
import { broadcast } from "./broadcast";

export const processHandler = async (req: Request, 
    res: Response, 
    job: Map<string, Job>,
    filePath : string,
    jobId: string,
    total: number
) => {

    if (job.has(jobId)) {
        const worker = new Worker('./dist/processWorker.js', {
            workerData: {
            filePath: filePath,
            total: total
        }});
        worker.on('message', (msg) => {
            job.set(jobId, {
                progress: msg.progress,
                total: total,
                status: msg.status,
                client: res
            })

            broadcast(jobId, msg, job, res);

            if (msg.status === 'finished' || msg.status === 'error') {
                job.delete(jobId);
            }
        })        
    }
    else {
        res.status(500);
        res.end("error");
    }


}