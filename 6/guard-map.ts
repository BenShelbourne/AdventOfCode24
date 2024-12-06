import * as fsPromise from 'fs/promises';

class Obstacle {
    x: number
    y: number

    constructor(xOrdintate: number, yOrdinate: number) {
        this.x = xOrdintate;
        this.y = yOrdinate;
    }
}

enum GuardDirection {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

class GuardDirectionMap {
    static getDirection(direction: GuardDirection): [number, number] {
        switch(direction) {
            case GuardDirection.UP: {
                return [-1,0];
            }
            case GuardDirection.DOWN: {
                return [1, 0];
            }
            case GuardDirection.LEFT: {
                return [0, -1];
            }
            case GuardDirection.RIGHT: {
                return [0, 1];
            }
        }
    }
}

class GuardMap {
    map: any[][];

    constructor(m: any[][]) {
        this.map = m;
    }

    length() {
        return this.map[0].length;
    }

    height() {
        return this.map.length;
    }

    getMap() {
        return this.map;
    }
}

class Guard {
    map: GuardMap;
    direction: GuardDirection = GuardDirection.UP;
    position: [x: number, y: number];
    moves = 1;

    constructor(guardMap: GuardMap, startPos: [number, number]) {
        this.map = guardMap;
        this.position = startPos;
    }

    turnRight(): void {
        switch(this.direction) {
            case GuardDirection.UP: {
                this.direction = GuardDirection.RIGHT;
                return;
            }
            case GuardDirection.DOWN: {
                this.direction = GuardDirection.LEFT;
                return;
            }
            case GuardDirection.LEFT: {
                this.direction = GuardDirection.UP;
                return;
            }
            case GuardDirection.RIGHT: {
                this.direction = GuardDirection.DOWN;
                return;
            }
        }
    }

    move(): boolean {
        const move: [number, number] = GuardDirectionMap.getDirection(this.direction)
        try {
            if (this.map.getMap()[this.position[0]+move[0]][this.position[1]+move[1]] instanceof Obstacle) {
                this.turnRight();
                return true;
            }
        } catch (TypeError) {
            return false;
        }
        this.position[0] += move[0];
        this.position[1] += move[1];
        if (this.map.getMap()[this.position[0]][this.position[1]] != 'X') {
            this.map.getMap()[this.position[0]][this.position[1]] = 'X'
            this.moves++;
        }
        return true;
    }
}

async function main() {
    const mapInput = await fsPromise.open('/home/benshe01/src/advent24/6/resources/input.txt', 'r');
    let guardStartPos: [number, number] = [0,0];
    let lineNo = 0;
    let map: any[][] = [];
    for await (const line of mapInput.readLines()) {
        let row: any[] = [];
        line.split('').forEach((point, index) => {
            if (point == '.') {
                row.push(point);
            } else if (point == '#') {
                row.push(new Obstacle(lineNo, index));
            } else if (point == '^') {
                guardStartPos = [lineNo, index];
                row.push('X');
            }
        });
        map.push(row);
        lineNo++;
    }

    const guardMap = new GuardMap(map);

    const guard = new Guard(guardMap, guardStartPos);
    let inBounds = true;

    while (inBounds) {
        inBounds = guard.move();
    };

    console.log('Guard Moves:', guard.moves);
}

main().catch(console.error);