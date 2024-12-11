import * as fsPromise from 'fs/promises';

class Stone {
    numbers: Array<number> = [];

    constructor(initialNumber: number) {
        this.numbers.push(initialNumber);
    }

    blink(): void {
        let newOrder: Array<number> = [];
        this.numbers.forEach((num, idx) => {
            if (num == 0) {
                newOrder.push(this.zeroToOne());
            } else if (num.toString().length % 2 == 0) {
                newOrder.push(...this.split(idx));
            } else {
                newOrder.push(this.multiply(idx));
            }
        });
        this.numbers = newOrder;
    }

    zeroToOne(): number {
        return 1;
    }

    split(index: number): Array<number> {
        const numberLength = this.numbers[index].toString().length;
        const numbers: Array<number> = this.numbers[index].toString().split('').map((val) => Number(val));
        const leftNumber = numbers.slice(0, numberLength/2);
        const rightNumber = numbers.slice(numberLength/2);
        return [Number(leftNumber.join('')), Number(rightNumber.join(''))];
    }

    multiply(index: number): number {
        return this.numbers[index] * 2024;
    }
}

async function main() {
    const fileInput = await fsPromise.readFile('/home/benshe01/src/advent24/11/resources/input.txt', 'utf-8');
    let stones: Array<Stone> = [];
    fileInput.split(' ').forEach((stone) => {
        stones.push(new Stone(Number(stone)));
    });

    for(let i = 0; i < 25; i++) {
        stones.forEach((stone) => stone.blink());
    }

    const line = stones.map((stone) => stone.numbers).flat();

    console.log('Length:', line.length);
}

main().catch(console.error);