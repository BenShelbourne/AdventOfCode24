import * as fsPromise from 'fs/promises';

class Node {
    element: number;
    next: any;

    constructor(val: number) {
        this.element = val;
        this.next = null;
    }

    hasNext() {
        return this.next;
    }
}

class EmptyNode extends Node {
    constructor(val: number) {
        super(val);
    }
}

class LinkedList {
    head: Node = new EmptyNode(-1);
    len = 0;

    append(element: number) {
        let node = new Node(element);
        let current: Node;

        if (this.head instanceof EmptyNode) {
            this.head = node;
        } else {
            current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }
        this.len++;
    }
}

class DecisionTree {
    values: LinkedList;

    constructor(line: LinkedList) {
        this.values = line;
    }

    isValid(target: number): boolean {
        return this.getLeaves(this.values.head.element, this.values.head).some((value) => value == target);
    }

    getLeaves(base: number, node: Node): Array<number> {
        if (node.hasNext()) {
            const multi: number = base * node.next.element;
            const add: number = base + node.next.element;
            const concat: number = Number(base.toString() + node.next.element.toString());

            if (node.next.hasNext()) {
                const multiBranch: Array<number> = this.getLeaves(multi, node.next);
                const addBranch: Array<number> = this.getLeaves(add, node.next);
                const concatBranch: Array<number> = this.getLeaves(concat, node.next);

                return [...multiBranch, ...addBranch, ...concatBranch];
            }

            return [multi, add, concat];
        }
        return [base];
    }
}

async function main() {
    const equationInput = await fsPromise.open('/home/benshe01/src/advent24/7/resources/input.txt', 'r');
    let total = 0;
    for await (const line of equationInput.readLines()) {
        const equation = line.split(":");
        const answer = Number(equation[0]);
        let list = new LinkedList();
        equation[1].trim().split(' ').forEach((val) => list.append(Number(val)));

        const tree = new DecisionTree(list);

        if (tree.isValid(answer)) {
            total += answer;
        }
    }

    console.log('Total:', total);
}

main().catch(console.error);