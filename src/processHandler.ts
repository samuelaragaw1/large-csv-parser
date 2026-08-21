import { Worker } from "node:worker_threads";
import { Job } from "./server";
import { Request, Response } from "express";
import { broadcast } from "./broadcast";

export const processHandler = async (req: Request, 
    res: Response, 
    job: Map<string, Job>,
    filePath : string,
    jobId: any,
    total: number
) => {
    if (job.has(jobId)) {
        try {
            await processWorker(filePath, total, jobId, job);
        }
        catch {
            console.log("There is An Error Will working")
        }
    }
    else {
        res.status(500);
        res.end("error");
    }
}



const processWorker = async (filePath: string, 
        total: number, 
        jobId: string,
        job: Map<string, Job>
    ) : Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const worker = new Worker('./dist/processWorker.js', {
            workerData: {
            filePath: filePath,
            total: total
        }});
    worker.on('message', (msg) => {
        const currentJob  = job.get(jobId);
        if (msg.status === 'processing') {
            if (currentJob) {
                currentJob.progress = msg.progress;
                currentJob.status = msg.status;
            }
            broadcast(jobId, msg, job,);
        }
        else if (msg.status === 'finished') {
            broadcast(jobId, msg, job);
            currentJob?.client?.end();
            resolve();
        }
        else if (msg.status === 'error') {
            broadcast(jobId, msg, job);
            currentJob?.client?.end();
            reject();
        }
    });
    }) 
}