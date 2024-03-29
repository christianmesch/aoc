class PriorityQueue {

    sortFunc;

    queue = [];

    constructor(sortFunc = (a, b) => a - b) {
        this.sortFunc = sortFunc;
    }

    enqueue(val) {
        const idx = this.queue.findIndex((v) => this.sortFunc(val, v) === -1);
        this.queue.splice(idx !== -1 ? idx : this.queue.length, 0, val);
    }

    dequeue() {
        return this.queue.shift();
    }

    peek() {
        return this.queue[0];
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    has(predicate = (value) => false) {
        return this.queue.findIndex(predicate) !== -1;
    }
}

module.exports = {
    PriorityQueue
}