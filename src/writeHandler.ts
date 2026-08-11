import { createWriteStream } from "node:fs";
import { Request, Response } from "express";

export const writeHandler = async (req: Request, res: Response) => {
    const fileName = crypto.randomUUID();
    const writeStream = createWriteStream(`./data/${fileName}`);
    req.pipe(writeStream);
}