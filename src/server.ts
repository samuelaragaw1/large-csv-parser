import {createServer} from "http";
import express, {Express} from "express";
import { writeHandler } from "./writeHandler";

const expressApp : Express = express();
expressApp.use(express.static(`./reactapp/dist`));
expressApp.post('/upload', writeHandler);

const server = createServer(expressApp);
server.listen(5000, ()=> {
    console.log("Listning to server 5000");
})