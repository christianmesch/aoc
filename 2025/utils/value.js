class Value {

    val;

    constructor(val) {
        this.val = val;
    }

    toString() {
        if (Array.isArray(this.val)) {
            return this.val.join('¤');
        }

        return this.val;
    }
}

module.exports = {
    Value
};