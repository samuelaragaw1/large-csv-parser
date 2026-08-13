import { parentPort , workerData } from "node:worker_threads";
import readline from 'readline';
import fs from 'fs';

async function countLine(fileName: string) {
    const r1 = readline.createInterface({
        input: fs.createReadStream(`./data/${fileName}`),
        crlfDelay: Infinity,
    })

    let count = 0
    for await (const line of r1) {
        count++;
    }

    return count;
}
async function main () {
    const lenght = await countLine(workerData.filePath);
    parentPort?.postMessage(lenght);
}

main();