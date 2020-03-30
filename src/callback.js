class EventalCallback {
    constructor(index, callback, type) {
        if (typeof callback !== 'function') {
            callback = this.default;
        }
        this.index = index;
        this.active = true;
        this.type = type;
        this.function = callback;
        let types = ['before', 'after', 'first', 'last', 'calc'];
        types.forEach(t => {
            Object.defineProperty(this, t, 
                { get: function() { return this.type == t } }    
            )
        }, this);
    }
    
    activate() {
        this.active = true;
        return this;
    }
    
    deactivate() {
        this.active = false;
        return this;
    }
    
    set function(fn) {
        if (typeof fn === 'function') {
            this._function = fn;
        } 
    }
    
    get function() {
        return this._function || this.default;
    }
    
    set type(o) {
        if (!['first', 'before', 'after', 'last', 'calc'].includes(o)) {
            this._type = 'any';
        }    
        this._type = o;
    }
    
    get type() {
        return this._type || 'any';
    }
    
    get default() {
        return this.type == 'calc' ? this._defaultCalc : this._default;
    }
    
    get order() {
        switch(this.type) {
            case 'first': return 1;
            break;
            case 'before': return 2;
            break;
            case 'after': return 4;
            break;
            case 'last': return 5;
            break;
            default: return 3;
            break;
        }
    }
    
    _default() {
        
    }
    
    _defaultCalc(arg) {
        return arg;
    }
}

module.exports = EventalCallback;