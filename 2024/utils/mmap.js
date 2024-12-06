class MMap {

    map = new Map();
    keyMap = new Map();

    set(key, value) {
        const sKey = key.toString();
        this.map.set(sKey, value);
        this.keyMap.set(sKey, key);
    }

    get(key) {
        const sKey = key.toString();
        return this.map.get(sKey);
    }

    keys() {
        return [...this.keyMap].map(([, k]) => k);
    }

    values() {
        return [...this.map].map(([, v]) => v);
    }

    entries() {
        const values = this.values();
        return this.keys().map((k, i) => [k, values[i]]);
    }

    clear() {
        this.keyMap.clear();
        this.map.clear();
    }

    size() {
        return this.map.size;
    }

    has(key) {
        return this.map.has(key.toString());
    }

    delete(key) {
        if (this.has(key)) {
            const value = this.map.get(key.toString());
            this.keyMap.delete(key.toString());
            this.map.delete(key.toString());

            return value;
        }

        return undefined;
    }

    copy() {
        const newMMap = new MMap();
        this.map.forEach((val, key) => newMMap.map.set(key, val));
        this.keyMap.forEach((val, key) => newMMap.keyMap.set(key, val));

        return newMMap;
    }
}

module.exports = {
    MMap
};