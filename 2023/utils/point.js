class Point {

    val = [];

    constructor(val = [0, 0]) {
        this.val = val;
    }

    move(delta, sub = false) {
        const d = Array.isArray(delta) ? new Point(delta) : delta;

        for (let i = 0; i < this.val.length; i++) {
            if (sub) {
                this.val[i] -= d.val[i];
            } else {
                this.val[i] += d.val[i];
            }
        }

        return this;
    }

    add(delta) {
        return (new Point([...this.val])).move(delta);
    }

    remove(delta) {
        return (new Point([...this.val])).move(delta, true);
    }

    x() {
        return this.val[0];
    }

    y() {
        return this.val[1];
    }

    z() {
        return this.val[2];
    }

    rotate(direction) {
        const [x, y] = this.val;
        switch (direction) {
            case 'L':
                return new Point([y, -x]);
            case 'R':
                return new Point([-y, x]);
        }

        return this;
    }

    turn(direction) {
        return (new Point([...this.val])).rotate(direction);
    }

    adjacent(includeDiagonal = false) {
        const [x, y, z] = this.val;
        let adj;

        if (z === undefined) {
            adj = [
                [x + 1, y],
                [x - 1, y],
                [x, y + 1],
                [x, y - 1]
            ];
        } else {
            adj = [
                [x + 1, y, z],
                [x - 1, y, z],
                [x, y + 1, z],
                [x, y - 1, z],
                [x, y, z + 1],
                [x, y, z - 1]
            ];
        }

        if (includeDiagonal) {
            adj.push([x + 1, y + 1]);
            adj.push([x + 1, y - 1]);
            adj.push([x - 1, y + 1]);
            adj.push([x - 1, y - 1]);
        }

        return adj.map((p) => new Point(p));
    }

    eq(other) {
        const o = Array.isArray(other) ? new Point(other) : other;
        if (this.val.length !== o.val.length) return false;
        return this.val.every((v, i) => v === o.val[i]);
    }

    manhattan(other) {
        const o = Array.isArray(other) ? new Point(other) : other;
        return this.val.map((v, i) => Math.abs(o.val[i] - v))
            .reduce((acc, curr) => acc + curr, 0);
    }

    isInBounds(bounds) {
        return this.val.every((v, i) => bounds.min[i] <= v && v <= bounds.max[i]);
    }

    // Bad name and implementation, will probably need to revisit at some point
    toDelta() {
        this.val = this.val.map((v) => v === 0 ? 0 : v < 0 ? -1 : 1);
        return this;
    }

    copy() {
        return new Point([...this.val]);
    }

    toString() {
        return this.val.join(',');
    }
}

module.exports = {
    Point
};