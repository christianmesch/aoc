const { sets } = require('./sets');

class MSet {

    set = new Set();
    map = new Map();

    constructor(value) {
        if (Array.isArray(value)) {
            this.#_arrayConstructor(value);
        } else if (value === null || value === undefined) {
            return;
        } else {
            this.#_valueConstructor(value);
        }
    }

    #_arrayConstructor(values) {
        this.addAll(values);
    }

    #_valueConstructor(value) {
        this.add(value);
    }

    addAll(values) {
        values.forEach((v) => this.add(v));
    }

    add(value) {
        const sValue = value.toString();
        if (!this.set.has(sValue)) {
            this.set.add(sValue);
            this.map.set(sValue, value);
        }
    }

    clear() {
        this.set.clear();
        this.map.clear();
    }

    size() {
        return this.set.size;
    }

    has(value) {
        return this.set.has(value.toString());
    }

    values() {
        return [...this.map].map(([, v]) => v);
    }

    keys() {
        return [...this.set];
    }

    delete(value) {
        if (this.has(value)) {
            this.set.delete(value.toString());
            this.map.delete(value.toString());
        }
    }

    isSuperset(other) {
        return sets.superset(this.set, other.set);
    }

    union(other) {
        return this.#stringSetToMSet([...sets.union(this.set, other.set)], other);
    }

    intersection(other) {
        return this.#stringSetToMSet([...sets.intersection(this.set, other.set)], other);
    }

    diff(other) {
        return this.#stringSetToMSet([...sets.diff(this.set, other.set)], other);
    }

    eq(other) {
        return sets.eq(this.set, other.set);
    }

    #stringSetToMSet(valuesSet, other) {
        return new MSet([...valuesSet].map((v) => {
            if (this.map.has(v)) return this.map.get(v);
            if (other.map.has(v)) return other.map.get(v);
        }));
    }

}

module.exports = {
    MSet
};