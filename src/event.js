const SrcerCallback = require('./callback');

class SrcerEvent {
    constructor(name) {
        if (!name) {
            throw new Error('Event name is required');
        }
        if (typeof name !== 'string') {
            throw new Error('Event name must be a string');
        }
        this.name = name;
        this._queue = {}
        this._calc = new SrcerCallback(name + '-0', 'calc');
        this.hasCalc = false;
        this._index = 0;
        this.count = 0;
        this.active = true;
    }

    get length() {
        return Object.values(this._queue).length;
    }

    get index() {
        this._index++;
        return this.name + '-' + this._index;
    }

    get queue() {
        return this.getCallbacks();
    }

    fire(caller, ...args) {
        let q = this.queue;
        this.count++;
        q.forEach(cb => {
            if (cb.active) {
                cb.function.call(caller, ...args);
            }
        }, this);
        return this;
    }

    calc(caller, ...args) {
        this.count++;
        if (this._calc.active) {
            return this._calc.function.call(caller, ...args);
        } else {
            return args && args.length ? args[0] : null;
        }
    }

    on(callback, option) {
        let index = this.index;
        if (option == 'first') {
            let oldFirst = this.getCallback('first');
            if (oldFirst) {
                oldFirst.type = 'before';
            }
        } else if (option == 'last') {
            let oldLast = this.getCallback('last');
            if (oldLast) {
                oldLast.type = 'after';
            }
        }
        if (typeof callback === 'string') {
            if (this._queue[callback] && this._queue[callback] instanceof SrcerCallback) {
                this._queue[callback].activate();
                return callback;
            } else if (this._calc && this._calc.index == callback) {
                this._calc.activate();
                return callback;
            }
        }
        let cb = new SrcerCallback(index, callback, option);
        if (cb.calc) {
            this.hasCalc = true;
            this._calc = cb;
        } else {
            this._queue[index] = cb;
        }
        return index;
    }

    onCalc(callback) {
        return this.on(callback, 'calc');
    }

    after(callback) {
        return this.on(callback, 'after');
    }

    before(callback) {
        return this.on(callback, 'before');
    }

    last(callback) {
        return this.on(callback, 'last');
    }

    first(callback) {
        return this.on(callback, 'last');
    }

    off(key) {
        if (this._queue.hasOwnProperty(key)) {
            this._queue[key].deactivate();
        } else if (this._calc.index == key) {
            this._calc.deactivate();
        } else {
            this.active = false;
        }
        return this;
    }

    reset() {
        this._queue = {};
        return this;
    }

    getCallbacks() {
        let q = Object.values(this._queue);
        q.sort((a, b) => {
            if (a.order == b.order) {
                return 0;
            }
            return a.order - b.order;
        });
        return q;
    }

    getCallback(key) {
        let len = this.length;
        if (!len) {
            return null;
        }
        if (key == 'last') {
            return this.queue[len - 1];
        } else if (key == 'first') {
            return this._queue[0];
        }
        return this._queue[key].function;
    }

    getCalc() {
        return this._calc.function;
    }
    
    set active(a) {
        if (a) {
            this._active = true;
        } else {
            this._active = false;
            this.reset();
        }
    }
    
    get active() {
        return this._active === false ? false : true;
    }

    set _queue(q) {
        let oldQ = this.__queue || {};

        this.__queue = q;

        if (!this.__queue || typeof this.__queue !== 'object' || Array.isArray(this.__queue)) {
            this.__queue = oldQ;
        }

    }

    get _queue() {
        return this.__queue || {};
    }
}

module.exports = SrcerEvent;