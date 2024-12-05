import * as fsPromise from 'fs/promises';

class PageRule {
    key: number;
    value: number;

    constructor(key: number, value: number) {
        this.key = key;
        this.value = value;
    }
}

class PageRules {
    rules: Array<PageRule>;

    constructor() {
        this.rules = [];
    }

    addRule(rule: PageRule): void {
        this.rules.push(rule);
    }

    isValue(value: number): boolean {
        return this.rules.some((rule) => rule.value == value);
    }

    keysForValue(value: number): Array<number> {
        return this.rules.map((rule) => {
            if (rule.value == value) {
                return rule.key;
            }
        }).filter((value) => value != undefined);
    }

    isGreaterRank(keys: Array<number>, value: number): number {
        let rank = 0;
        const isValue = this.isValue(value);
        keys.forEach((key) => {
            if(key == value){
                rank += 0;
            }
            if (isValue && this.keysForValue(value).includes(key)) {
                rank += 1;
            }
        });
        return rank;
    }
}

class PageUpdate {
    pageRules: PageRules;

    constructor(rules: PageRules) {
        this.pageRules = rules;
    }

    isValid(updates: Array<number>): boolean {
        return updates.every((update, index) => {
            if (this.pageRules.isValue(update)) {
                const keys = this.pageRules.keysForValue(update);
                const found = updates.slice(index).some((u) => keys.includes(u));
                if (found) {
                    return false;
                }
            }
            return true;
        });
    }

    getMiddleNumber(updates: Array<number>): number {
        return updates[(updates.length-1)/2];
    }

    order(updates: Array<number>): Array<number> {
        if (this.isValid(updates)) {
            return updates;
        }

        let correctOrder: Array<number> = Array<number>(updates.length).fill(0);

        updates.forEach((update) => {
            const updateIndex = this.pageRules.isGreaterRank(updates, update);
            correctOrder[updateIndex] = update;
        });

        return correctOrder;
    }
}

async function main() {
    const pageRulesInput = await fsPromise.open('/home/benshe01/src/advent24/5/resources/page-rules.txt', 'r');
    const pageUpdatesInput = await fsPromise.open('/home/benshe01/src/advent24/5/resources/page-updates.txt', 'r');

    let pageRules = new PageRules;
    let correctPageNumbers = 0;
    let incorrectPageNumbers = 0;

    for await (const line of pageRulesInput.readLines()) {
        const rule = line.split("|");
        pageRules.addRule(new PageRule(Number(rule[0]), Number(rule[1])));
    }

    const pageUpdates = new PageUpdate(pageRules);

    for await (const line of pageUpdatesInput.readLines()) {
        const updates = line.split(",").map((value) => Number(value));
        if (pageUpdates.isValid(updates)) {
            correctPageNumbers += pageUpdates.getMiddleNumber(updates);
        } else {
            const correctOrder = pageUpdates.order(updates);
            incorrectPageNumbers += pageUpdates.getMiddleNumber(correctOrder);
        }
    }

    console.log('Correct Page Numbers:', correctPageNumbers);
    console.log('Incorrect Page Numbers:', incorrectPageNumbers);
}

main().catch(console.error);