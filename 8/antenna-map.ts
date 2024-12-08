import * as fsPromise from 'fs/promises';

class AntiNode {
    row: number;
    positionInRow: number;

    constructor(x: number, y: number) {
        this.row = x;
        this.positionInRow = y;
    }

    isUnique(map: any[][]): boolean {
        return !(this.hasFrequencyAtPoint(map)) && this.inBounds(map);
    }

    inBounds(map: any[][]): boolean {
        return this.row > -1 &&
            this.positionInRow > -1 &&
            this.row < map.length &&
            this.positionInRow < map[0].length;
    }

    hasFrequencyAtPoint(map: any[][]): boolean {
        try {
            if (map[this.row][this.positionInRow] instanceof AntiNode) {
                return true;
            }
        } catch(err) {
            return true;
        }
        map[this.row][this.positionInRow] = this;
        return false;
    }
}

class Frequency {
    row: number;
    positionInRow: number;
    frequency: string;

    constructor(x: number, y: number, freq: string) {
        this.row = x;
        this.positionInRow = y;
        this.frequency = freq;
    }

    getDistance(cmp: Frequency): [number, number] {
        return [Math.abs(this.row - cmp.row), Math.abs(this.positionInRow - cmp.positionInRow)];
    }

    getAntinodes(cmp: Frequency): Array<AntiNode> {
        let thisRow = 0;
        let cmpRow = 0;
        let thisPos = 0;
        let cmoPos = 0;
        let distances = this.getDistance(cmp);
        if (this.row < cmp.row) {
            // above
            thisRow = this.row - distances[0];
            cmpRow = cmp.row + distances[0];
        } else {
            // below
            thisRow = thisRow + distances[0];
            cmpRow = cmp.row - distances[0];
        }

        if (this.positionInRow > cmp.positionInRow) {
            // right
            thisPos = this.positionInRow + distances[1];
            cmoPos = cmp.positionInRow - distances[1];
        } else {
            // left
            thisPos = this.positionInRow - distances[1];
            cmoPos = cmp.positionInRow + distances[1];
        }
        return [new AntiNode(thisRow, thisPos), new AntiNode(cmpRow, cmoPos)];
    }
}

class FrequencyGroup {
    frequency: string;
    frequencies: Array<Frequency> = [];
    antinodes: Array<AntiNode> = [];

    constructor(freq: Frequency) {
        this.frequency = freq.frequency;
        this.frequencies.push(freq);
    }

    collectAntinodes() {
        this.frequencies.forEach((freq, idx) => {
            const pairs: Array<Frequency> = this.frequencies.slice(idx+1);
            pairs.forEach((pair) => {
                this.antinodes.push(...freq.getAntinodes(pair));
            });
        });
    }

    getAntinodes(): Array<AntiNode> {
        this.collectAntinodes();
        return this.antinodes;
    }
}

class FrequencyGroups {
    frequencyGroups: Array<FrequencyGroup> = [];

    constructor(){}

    addFrequency(frequency: Frequency): Frequency {
        const freqIdx = this.frequencyGroups.map((group) => group.frequency).indexOf(frequency.frequency);
        if (freqIdx == -1) {
            const newGroup = new FrequencyGroup(frequency);
            this.frequencyGroups.push(newGroup);
        } else {
            this.frequencyGroups[freqIdx].frequencies.push(frequency);
        }
        return frequency;
    }
}

async function main() {
    const mapInput = await fsPromise.open('/home/benshe01/src/advent24/8/resources/input.txt', 'r');
    let map: any[][] = [];
    let lineNo = 0;
    const frequencies = new FrequencyGroups();
    for await (const line of mapInput.readLines()) {
        let row: any[] = [];
        line.split('').forEach((val, idx) => {
            const char = val.match(/([a-zA-Z]{1}|\d{1})/gm)?.[0];
            if (char) {
                frequencies.addFrequency(new Frequency(lineNo, idx, char));
            }
            row.push(val);
        });
        map.push(row);
        lineNo++;
    }

    let uniqueAntinodes = [];
    const antinodes: Array<AntiNode> = frequencies.frequencyGroups.map((group) => group.getAntinodes()).flat();

    antinodes.forEach((antinode) => {
        if (antinode.isUnique(map)) {
            uniqueAntinodes.push(antinode);
        }
    });

    console.log('Unique Antinodes:', uniqueAntinodes.length);
}

main().catch(console.error);