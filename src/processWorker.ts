import { createReadStream } from "node:fs";
import { workerData, parentPort } from "node:worker_threads";
import readline from "readline";
import { writeFile } from "node:fs/promises";

async function  process() {
    try{
        const r1 = readline.createInterface(
            {
                input: createReadStream(
                    `./data/${workerData.filePath}`
                ),
                crlfDelay: Infinity
            }
        )
        let departmentSet : string[] = [];
        let salesSet : number [] = [];
        let count = 0;
        for await (const line of r1) {
            if (count < 6) {
                count++;
                continue;
            }
            const row: string[] = line.split(',');
            const dept: string = row[0];
            const sales = Number.parseFloat(row[1]);


            if (!departmentSet.includes(dept)) {
                departmentSet.push(dept);
                salesSet.push(sales);
            }
            else {
                const index = departmentSet.indexOf(dept);
                salesSet[index] += sales;
            }
            if (count % 100 === 0) {
                parentPort?.postMessage({
                    progress: Math.round(count/workerData.total * 100),
                    status: 'processing'
                });
            }
            count++;
        }

        const dowloadFileName = crypto.randomUUID();

        await writeFile(`./data/${dowloadFileName}.csv`, 'Departmet,Total_Sales\n');
        for(let line = 0; line < departmentSet.length; line++) {
            await writeFile(`./data/${dowloadFileName}.csv`, 
                `${departmentSet[line]},${salesSet[0]}` , 
                {flag: 'a'},);
        }


        parentPort?.postMessage({
            progress: Math.round(count/workerData.total * 100),
            status: 'finished',
            result: `${dowloadFileName}.csv`
        });
    } catch {
        parentPort?.postMessage({
            progress: Math.round(0/workerData.total * 100),
            status: 'error'
        })
    }
}

process();