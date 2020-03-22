const SrcerEvent = require('./event');

class SrcerEvents {
    constructor(caller) {
        this.setCaller(caller);
        this._events = {}
        this._index = 0;
        let types = ['before', 'after', 'first', 'last', 'calc'];
        types.forEach(type => {
            let method = type == 'calc' ? 'onCalc' : type;
            this[method] = this._updateTypes(type);
        }, this);
        let methods = ['fire', 'calc', 'off'];
        methods.forEach(m => {
           this[m] = this._update(m); 
        }, this);
    }
    
    get length() {
        return this.events.length;
    }
    
    get index() {
        this._index++;
        return 'ev-' + this._index;
    }
    
    on(event, callback, option) {
        if (option && typeof option === 'boolean') {
            option = 'calc';
        }
        this.event = event;
        return this.update(event, 'on', callback, option);
     }
    
    set event(e) {
        if (!this.exists(e)) {
           this._events[e] = new SrcerEvent(e, this.caller);
        }
    }
    
    set events(e) {
        if (!e) {
            return;
        }
        if (Array.isArray(e)) {
            e.forEach(name => {
                this.event = name;
            }, this);
        } else if (typeof e === 'string') {
            this.event = e;
        }
    }
    
    get events() {
        return Object.keys(this._events) || {};
    }
    
    get state() {
        let $this = this;
        return Object.keys(this._events).reduce((acc, e) =>{
            let ev = $this._events[e];
            if (ev.length || ev.hasCalc) {
                acc[e] = ev;
            }
            return acc;
        }, {});
    }
    
    get(event) {
        return this._events[event];
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
    
    exists(ev) {
        let e = this.get(ev);
        return e && e instanceof SrcerEvent;
    }
    
    reset(event) {
        if (event) {
            this.update(event, 'reset');
        } else {
            this._events = {};
        }
        return this;
    }
    
    update(event, callback, ...args) {
        let ev = this.get(event);
        let res = false;
        if (ev instanceof SrcerEvent) {
            if (typeof callback === 'string' && typeof ev[callback] === 'function') {
                res = ev[callback].call(ev, ...args);
            } else if (typeof callback === 'function') {
                res = callback.call(this.caller, ev, ...args);
            }   
        }
        return res;
    }
    
    _updateTypes(type) {
        return function(event, callback) {
            return this.on(event, callback, type);
        }
    }
    
    _update(method) {
        return function(event, ...args) {
            return this.update(event, method, ...args);
        }
    }
    
    static get instance() {
        return new SrcerEvents();
    }
}

module.exports = SrcerEvents;