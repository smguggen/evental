class Events {
    constructor(caller) {
        this.setCaller(caller);
        this.calcs = {}
        this.calcKeys = {};
        this.counts = {};
        this._events = {}
        this._index = 0;
    }
    
    get length() {
        return this.events.length;
    }
    
    get index() {
        this._index++;
        return 'ev-' + this._index;
    }
    
    get state() {
        let $this = this;
        return Object.keys(this._events).reduce((acc, ev) => {
            let res = $this._events[ev];
            let keys = res ? Object.keys(res) : [];
            acc[ev] = {};
            acc[ev].handlers = keys;
            acc[ev].calc = $this.calcKeys[event];
            return acc;
        }, {});
    }
    
    get events() {
        return Object.keys(this._events);
    }
    
    reset(event) {
        if (event) {
            this._events[ev] = {}
        } else {
            this._events = {};
        }
        return this;
    }
    
    getEvent(ev, key) {
        let event = this._events[ev];
        if (key && event) {
            return event[key];
        } else {
            if (!event) {
                return [];
            }
            return Object.values(event);
        }
    }
    
    getCalc(ev) {
        return this.calcs[ev];
    }

    on(event, callback, calc) {
        if (typeof callback !== 'function') {
            return false;
        }
        let index = this.index;
        if (!this.events.includes(event)) {
            this._events[event] = {};
            this.counts[event] = 0;
        } 
        if (typeof callback === 'function') {
            if (calc) {
                this.calcs[event] = callback;
                this.calcKeys[event] = index;
            } else {
                this._events[event][index] = callback;
            }
        }
        return index;
    }
    
    off(event, key) {
        let ev = this._events[event];
        if (ev && ev.hasOwnProperty(key)) {
            delete ev[key];
        }
        if (this.calcKeys[event] && this.calcKeys[event] == key) {
            this.calcKeys[event] = null;
            this.calcs[event] = () => { return null }
        }
    }

    onCalc(event, callback) {
        return this.on(event, callback, true);
    }
    
    calc(event, ...args) {
        this.counts[event]++;
        let res = null;
        if (typeof this.calcs[event] === 'function') {
            res = this.calcs[event].call(this.caller, ...args);
        }
        return res;
    }

    fire(event, ...args) {
        let events = this.getEvent(event);
        if (!this.counts[event]) {
            this.counts[event] = 0;
        }
        this.counts[event]++;
        if (events && events.length) {
            events.forEach(ev => {
                ev.call(this.caller, ...args)
            }, this);
        }
        return this;
    }
    
    setCaller(caller) {
        if (!caller || 
            (typeof caller !== 'function' &&
            typeof caller != 'object')
        ) {
           caller = this; 
        }
        this.caller = caller;
        return this;
    }
    
    static get instance() {
        return new Events();
    }
}

module.exports = Events;