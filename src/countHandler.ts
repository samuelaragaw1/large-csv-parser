import { Response, Request } from "express";
import { Worker } from "node:worker_threads";
import { Job } from "./server";
import { log } from "node:console";

export const countHandler = async (req: Request, res: Response, job: Map<string, Job>) => {
    try {
        await countWorker(job, res, req);
    }
    catch {
        console.log("There an Error while counting");
    }
}

const countWorker = async (job: Map<string, Job>, res: Response, req: Request): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const jobId = crypto.randomUUID();
        // const total = await countLine(req.body.fileName);
        const worker = new Worker('./dist/countWorker.js', {
            workerData: {
                filePath: req.body.fileName
            }
        })
        worker.on('message', (msg)=> {
            job.set(jobId, {
                progress: 0, 
                total: msg, 
                status: 'ready', 
                client: res
            });
            res.json({
                jobId: jobId,
                total: msg,
            })
        })
        worker.on('error', () => {
            res.status(500);
            res.end('error');
            reject();
        })
        worker.on('exit', (code) => {
            if (code != 0) {
                res.status(500);
                res.end('error');
                reject();
                return;
            }
            resolve();
        })
    })
}