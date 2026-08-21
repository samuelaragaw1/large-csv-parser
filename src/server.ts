import {createServer} from "http";
import express, {Express} from "express";
import { writeHandler } from "./writeHandler";
import { countHandler } from './countHandler';
import { Request, Response } from "express";
import { processHandler } from "./processHandler";
import { SSEHandler } from "./SSEHandler";

export type Job = {
    progress: number | undefined | null,
    total: number,
    status: 'ready' | 'processing' | 'finished' | 'error' | undefined | null,
    client: express.Response | null | undefined
}

const job = new Map<string, Job>();

const expressApp : Express = express();

expressApp.use(express.static(`./reactapp/dist`));
expressApp.use(express.json());
expressApp.post('/upload', writeHandler);
expressApp.post('/process', async (req: Request, res: Response) => {
    countHandler(req, res, job);
});
expressApp.post('/process/:jobId', async (req: Request, res: Response ) => {
    const { jobId } = req.params;
    const { total, processFile } = req.body;
    await processHandler(req, res, job, processFile, jobId ,total);
});
expressApp.get('/process/:jobId/progress', (req: Request, res: Response) => {
    const { jobId } = req.params;
    SSEHandler(req, res, job, jobId);
});
expressApp.use('/download/:file', (req: Request, res: Response) => {
    const {file} = req.params;
    console.log(file);
    res.download(`./data/${file}`);
})

const server = createServer(expressApp);
server.listen(5000, ()=> {
    console.log("Listning to server 5000");
})