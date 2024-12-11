class Stones {
    blinkCache: Map<number, Array<number>> = new Map();
    startBlinkingCache: Map<string, number> = new Map();

    blink(stone: number): Array<number> {
        if (this.blinkCache.has(stone)) {
            return this.blinkCache.get(stone)!;
        }

        let result: Array<number>;
        if (stone == 0) {
            result = [1];
        } else if (stone.toString().length % 2 == 0) {
            const numberLength = stone.toString().length;
            const numbers: Array<number> = stone.toString().split('').map((val) => Number(val));
            const leftNumber = numbers.slice(0, numberLength / 2);
            const rightNumber = numbers.slice(numberLength / 2);
            result = [Number(leftNumber.join('')), Number(rightNumber.join(''))];
        } else {
            result = [stone * 2024];
        }

        this.blinkCache.set(stone, result);
        return result;
    }

    start_blinking(stone: number, remaining: number): number {
        const cacheKey = `${stone}-${remaining}`;
        if (this.startBlinkingCache.has(cacheKey)) {
            return this.startBlinkingCache.get(cacheKey)!;
        }

        let result: number;
        if (remaining == 0) {
            result = 1;
        } else {
            result = this.blink(stone).map((s) => this.start_blinking(s, remaining - 1)).flat().reduce((prev, curr) => prev + curr);
        }

        this.startBlinkingCache.set(cacheKey, result);
        return result;
    }
}

async function main() {
    const stones: Array<number> = [773, 79858, 0, 71, 213357, 2937, 1, 3998391];
    const blink = new Stones();
    let total = 0;

    for (const stone of stones) {
        total += blink.start_blinking(stone, 75);
    }

    console.log('Total:', total);
}

main().catch(console.error);