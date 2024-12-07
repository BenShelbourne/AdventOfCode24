export class Node {
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

export class EmptyNode extends Node {
    constructor(val: number) {
        super(val);
    }
}

export class LinkedList {
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