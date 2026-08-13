import { Response, Request } from "express";
import fs from "node:fs";
import { Worker } from "node:worker_threads";
import readline from 'readline';

export const countHandler = async (req: Request, res: Response, job: any) => {
    const jobId = crypto.randomUUID();
    // const total = await countLine(req.body.fileName);
    const worker = new Worker('./dist/countWorker.js', {
        workerData: {
            filePath: req.body.fileName
        }
    })
    worker.on('message', (msg)=> {
        job.set(jobId, {progress: 0, total: msg, status: 'ready'});
        res.json({
            jobId: jobId,
            total: msg,
        })
    })
    worker.on('error', () => {
        res.status(500);
        res.end('error');
    })
    worker.on('exit', (code) => {
        if (code != 0) {
            res.status(500);
            res.end('error');
        }
    })
}