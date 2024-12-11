class Cache {

    map = new Map();

    set(key, value) {
        const sKey = JSON.stringify(key);
        this.map.set(sKey, value);
    }

    clear() {
        this.map.clear();
    }

    size() {
        return this.map.size;
    }

    has(key) {
        const sKey = JSON.stringify(key);
        return this.map.has(sKey);
    }

    get(key) {
        const sKey = JSON.stringify(key);
        return this.map.get(sKey);
    }

    getOrCompute(key, orCompute = () => null) {
        const sKey = JSON.stringify(key);
        if (!this.map.has(sKey)) {
            this.map.set(sKey, orCompute.apply());
        } 
        
        return this.map.get(sKey);
    }
}

module.exports = {
    Cache
};