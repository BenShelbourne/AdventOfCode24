import * as fsPromise from 'fs/promises';

async function main() {
    const fileInput = await fsPromise.readFile('/home/benshe01/src/advent24/9/resources/input.txt', 'utf-8');

    let disk: Array<string> = [];
    let checksum = 0;

    fileInput.split('').forEach((value, index) => {
        const val = Number(value);
        for (let i = 0; i < val; i++) {
            if (index % 2 == 1) {
                disk.push('.');
            } else {
                disk.push((index/2).toString());
            }
        }
    });

    for(let i = disk.length - 1; i > 0; i--) {
        const firstSpace = disk.indexOf('.');
        if (firstSpace < i) {
            disk[firstSpace] = disk[i];
            disk[i] = '.';
        }
    }

    disk.forEach((value, index) => {
        if (value != '.'){
            checksum += (Number(value) * Number(index));
        }
    });

    console.log('Checksum:', checksum);
}

main().catch(console.error);