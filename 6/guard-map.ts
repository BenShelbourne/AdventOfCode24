import * as fsPromise from 'fs/promises';

class InfinteLoopError extends Error {}

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

    copy() {
        return this.map.map((column) => {
            return column.map((row) => row);
        });
    }
}

class GuardPosition {
    x: number
    y: number
    direction: GuardDirection

    constructor(x: number, y: number, direction: GuardDirection) {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    equals(cmp: GuardPosition): boolean {
        if (this.x == cmp.x && this.y == cmp.y && this.direction == cmp.direction) {
            return true;
        }
        return false;
    }
}

class Guard {
    map: GuardMap;
    direction: GuardDirection = GuardDirection.UP;
    position: GuardPosition;
    moves = 1;
    positions: Array<GuardPosition> = [];

    constructor(guardMap: GuardMap, startPos: [number, number]) {
        this.map = guardMap;
        this.position = new GuardPosition(startPos[0], startPos[1], this.direction);
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
        let nextPos: [x: number, y: number] = [-1,-1];
        let nextPoint: String | Obstacle = '.';
        try {
            nextPos = [this.position.x + move[0], this.position.y + move[1]];
            nextPoint = this.map.getMap()[nextPos[0]][nextPos[1]];
            if (this.positionContains(new GuardPosition(nextPos[0], nextPos[1], this.direction))) {
                throw new InfinteLoopError;
            }
            if (nextPoint instanceof Obstacle) {
                this.turnRight();
                return true;
            } else if (nextPos[1] >= this.map.length() || nextPos[1] < 0) {
                throw TypeError;
            }
        } catch (err) {
            if (err instanceof InfinteLoopError) {
                throw err;
            }
            return false;
        }
        this.position = new GuardPosition(nextPos[0], nextPos[1], this.direction);
        if (nextPoint != 'X') {
            this.map.getMap()[this.position.x][this.position.y] = 'X'
            this.positions.push(this.position);
            this.moves++;
        }
        return true;
    }

    positionContains(pos: GuardPosition): boolean {
        return this.positions.some((position) => pos.equals(position));
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

    let obstacles: Array<Obstacle> = []
    map.forEach((value, column) => {
        value.forEach((val, row) => {
            if (val == 'X') {
                obstacles.push(new Obstacle(column, row)); // potential out by one again
                map[column][row] = '.'
            }
        });
    });

    let workingObstacles: Array<Obstacle> = [];
    obstacles.forEach((obstacle) => {
        let newMap: any[][] = guardMap.copy();
        newMap[obstacle.x][obstacle.y] = obstacle;

        console.log('Map for obstacle:', obstacle);

        const newGuardMap = new GuardMap(newMap);
        const newGuard = new Guard(newGuardMap, guardStartPos);
        try {
            let inBounds = true;

            while (inBounds) {
                inBounds = newGuard.move();
            };
        } catch (err: any) {
            if (err instanceof InfinteLoopError) {
                console.log('Cause:', newGuard.position);
            }
            workingObstacles.push(obstacle);
        }
        newMap = [];
    });

    console.log('Working Obstacles', workingObstacles.length);
}

main().catch(console.error);