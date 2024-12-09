import * as fsPromise from 'fs/promises';

class DiskObject {
    size: number;
    id: number;

    constructor(s: number, i: number) {
        this.size = s;
        this.id = i;
    }
}

class File extends DiskObject {}

class DiskSpace extends DiskObject {}

async function main() {
    const fileInput = await fsPromise.readFile('/home/benshe01/src/advent24/9/resources/input.txt', 'utf-8');

    let disk: Array<DiskObject> = [];
    let checksum = 0;

    fileInput.split('').forEach((value, index) => {
        const val = Number(value);
        if (index % 2 == 1) {
            disk.push(new DiskSpace(val, index));
        } else {
            disk.push(new File(val, index/2));
        }
    });

    // part 1
    // for(let i = disk.length - 1; i > 0; i--) {
    //     const firstSpace = disk.indexOf('.');
    //     if (firstSpace < i) {
    //         disk[firstSpace] = disk[i];
    //         disk[i] = '.';
    //     }
    // }

    // part 2
    for(let i = disk.length - 1; i > 0; i--) {
        if (disk[i] instanceof DiskSpace) {
            continue;
        }
        if (disk[i] instanceof File) {
            const file: File = disk[i];
            const diskSpaces: Array<DiskSpace> = disk.filter((val, idx) => val instanceof DiskSpace && idx < i);
            for(const space of diskSpaces) {
                if (file.size == space.size) {
                    const spaceIndex = disk.indexOf(space);
                    disk[spaceIndex] = file;
                    disk[i] = space;
                    break;
                } else if (file.size < space.size) {
                    const spaceIndex = disk.indexOf(space);
                    disk[spaceIndex] = file;
                    disk[i] = new DiskSpace(file.size, i);
                    disk.splice(spaceIndex+1, 0, new DiskSpace(space.size - file.size, spaceIndex+1));
                    break;
                }
            };
        }
    }

    let formatDisk: Array<number| string> = []
    disk.forEach((obj) => {
        for(let i = 0; i < obj.size; i++) {
            if(obj instanceof File) {
                formatDisk.push(obj.id);
            } else {
                formatDisk.push('.')
            }
        }
    });

    formatDisk.forEach((value, index) => {
        if (value != '.'){
            checksum += (Number(value) * Number(index));
        }
    });

    console.log('Checksum:', checksum);
}

main().catch(console.error);