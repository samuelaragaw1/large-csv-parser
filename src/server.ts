import {createServer} from "http";
import express, {Express} from "express";
import { writeHandler } from "./writeHandler";
import { countHandler } from './countHandler';
import { Request, Response } from "express";

const job = new Map();

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

    
})

const server = createServer(expressApp);
server.listen(5000, ()=> {
    console.log("Listning to server 5000");
})