import { createWriteStream } from "node:fs";
import { Request, Response } from "express";

export const writeHandler = async (req: Request, res: Response) => {
    const fileName = crypto.randomUUID();
    const writeStream = createWriteStream(`./data/${fileName}.csv`);
    req.pipe(writeStream);
    writeStream.on('finish', () => {
        res.status(200);
        res.json({
            fileName: `${fileName}.csv`
        });
    })
    writeStream.on('error', () => {
        res.status(500);
        res.send('error');
    })
}
