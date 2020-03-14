class Events {
    constructor(valid) {
        this.valid = Array.isArray('valid') ? valid : [];
        this.calcs = {}
        this.counts = {};
        this.valid.forEach(ev => {
            this[ev] = [];
            this.calcs[ev] = null;
            this.counts[ev] = 0;
        }, this);
    }

    validate(ev) {
        if (Array.isArray(ev)) {
            ev.forEach(e => {
                this._validate(e);
            }, this);
        } else {
            this._validate(ev);
        }
    }

    on(event, callback, calc) {
        if (typeof callback !== 'function') {
            return;
        }
        if (this.valid.includes(event) && typeof callback === 'function') {
            this[event].push(callback);
            if (calc || !this.calcs[event]) {
                this.calcs[event] = callback;
            }
        }
    }
    
    calc(event, ...args) {
        this.counts[event]++;
        let res = null;
        if (typeof this.calcs[event] === 'function') {
            res = this.calcs[event].call(this, ...args);
        }
        return res;
    }

    fire(event, ...args) {
        this.counts[event]++;
        if (this.valid.includes(event) && this[event].length) {
            this[event].forEach(ev => {
                ev.call(this, ...args)
            }, this);
        }
        return this;
    }
    
    _validate(ev) {
        if (!this.valid.includes(ev)) {
            this.valid.push(ev);
        }
    }
}

module.exports = Events;