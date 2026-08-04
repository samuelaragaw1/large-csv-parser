import {createServer} from "http";
import express, {Express, Request, Response} from "express";

const expressApp : Express = express();
expressApp.get('{*splat}', (req: Request, res: Response) => {
    res.end("Hello, World");
})

const server = createServer(expressApp);
server.listen(5000, ()=> {
    console.log("Listning to server 5000");
})