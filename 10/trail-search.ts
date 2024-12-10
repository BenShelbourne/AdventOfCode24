import * as fsPromise from 'fs/promises';

class TrailHead {
    row: number;
    positionInRow: number;
    map: any[][];
    trails: Array<[number, number]> = [];
    search = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    up: [number, number] = [-1,0];
    down: [number, number] = [1,0];
    left: [number, number] = [0,-1];
    right: [number, number] = [0,1];

    constructor(x: number, y: number, m: any[][]) {
        this.row = x;
        this.positionInRow = y;
        this.map = m;
    }

    isMoveValid(position: [number, number], direction: [number, number]): boolean {
        return position[0] + direction[0] > -1 &&
                position[0] + direction[0] < this.map.length &&
                position[1] + direction[1] > -1 &&
                position[1] + direction[1] < this.map[0].length;
    }

    isMoveCorrect(position: [number, number], search: string): boolean {
        return this.map[position[0]][position[1]] == search;
    }

    findTrail(searchIdx: number, position: [number, number]): void {
        if (searchIdx == this.search.length) {
            if (this.trails.some((val) => val[0] == position[0] && val[1] == position[1])){
                return;
            }
            this.trails.push(position);
            return;
        }

        const searchNumber = this.search[searchIdx];

        if (this.isMoveValid(position, this.up)) {
            const newPos: [number, number] = [position[0] + this.up[0], position[1] + this.up[1]];
            if (this.isMoveCorrect(newPos, searchNumber)) {
                this.findTrail(searchIdx+1, newPos);
            }
        }
        if (this.isMoveValid(position, this.down)) {
            const newPos: [number, number] = [position[0] + this.down[0], position[1] + this.down[1]];
            if (this.isMoveCorrect(newPos, searchNumber)) {
                this.findTrail(searchIdx+1, newPos);
            }
        }
        if (this.isMoveValid(position, this.left)) {
            const newPos: [number, number] = [position[0] + this.left[0], position[1] + this.left[1]];
            if (this.isMoveCorrect(newPos, searchNumber)) {
                this.findTrail(searchIdx+1, newPos);
            }
        }
        if (this.isMoveValid(position, this.right)) {
            const newPos: [number, number] = [position[0] + this.right[0], position[1] + this.right[1]];
            if (this.isMoveCorrect(newPos, searchNumber)) {
                this.findTrail(searchIdx+1, newPos);
            }
        }
    }

    findAllTrails(): void {
        this.findTrail(0, [this.row, this.positionInRow]);
    }
}

async function main() {
    const fileInput = await fsPromise.open('/home/benshe01/src/advent24/10/resources/input.txt', 'r');
    let map: any[][] = [];
    let lineNo = 0;
    for await (const line of fileInput.readLines()) {
        let row: any[] = [];
        line.split('').forEach((val, idx) => {
            if (val == '0') {
                row.push(new TrailHead(lineNo, idx, map))
            } else {
                row.push(val);
            }
        });
        map.push(row);
        lineNo++;
    }

    map.flat().filter((val) => val instanceof TrailHead).forEach((trailhead) => trailhead.findAllTrails());

    const trails: number = map
                        .flat()
                        .filter((val) => val instanceof TrailHead)
                        .map((trailhead) => trailhead.trails.length)
                        .reduce((sum, current) => sum + current);

    console.log('Trails:',trails);
}

main().catch(console.error);