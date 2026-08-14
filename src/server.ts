import {createServer} from "http";
import express, {Express} from "express";
import { writeHandler } from "./writeHandler";
import { countHandler } from './countHandler';
import { Request, Response } from "express";
import { processHandler } from "./processHandler";
import { SSEHandler } from "./SSEhandler";

export type Job = {
    progress: number | undefined | null,
    total: number,
    status: 'ready' | 'processing' | 'finised' | 'error' | undefined | null,
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
expressApp.post('/process/:jobId', (req: Request, res: Response ) => {
    const { jobId } = req.params;
    const { total, filePath } = req.body;
    console.log("Process Handler Excuted");
    processHandler(req, res, job, filePath, jobId[0] ,total);
});
expressApp.post('/process/:jobId/process', (req: Request, res: Response) => {
    const { jobId } = req.params;
    SSEHandler(req, res, job, jobId[0]);
}) 

const server = createServer(expressApp);
server.listen(5000, ()=> {
    console.log("Listning to server 5000");
})