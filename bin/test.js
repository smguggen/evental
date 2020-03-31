#!/usr/bin/env node

const assert = require('assert');
const evental = require('../index').instance;

let tester = 1;

let callback1 = evental.on('test', number => {
    assert.equal(tester, number);
    tester = 2;
});
assert.equal(tester, 1);

let callback2 = evental.on('test', number => {
    assert.equal(number, 1);
    assert.equal(tester, 2);
    tester = 1; 
});
assert.notEqual(callback1, callback2);
evental.fire('test', tester);
assert.equal(evental.count('test'), 1);
assert.equal(tester, 1);

evental.off('test', callback2);
evental.fire('test', tester);
assert.equal(evental.count('test'), 2);
assert.equal(tester, 2);
let calced = evental.calc('test', tester);
assert.equal(evental.count('test'), 3);
assert.equal(calced, null);
evental.on('test', number => {
    return number + 5;
}, true);
calced = evental.calc('test', tester);
assert.equal(evental.count('test'), 4);
assert.equal(calced, 7);
evental.reset();
assert.ok(evental.length == 0, 'Evental object failed to reset');
let obj = {
    count: 19
}
evental.setCaller(obj);
evental.on('test', function() {
    assert.equal(this.count, 19);
});
evental.fire('test');
assert.equal(evental.count('test'), 5);
evental.fire('newEvent');
assert.ok(evental._events.newEvent.active === false);
assert.ok(evental._events.test.active === true);

evental.reset();
let order = [];
evental.after('order', () => {
   order.push(4);
});

evental.on('order', () => {
    order.push(3);
});

evental.last('order', () => {
    order.push(5);
});

evental.first('order', () => {
    order.push(1); 
});

evental.before('order', () => {
    order.push(2); 
});

evental.fire('order');

order.forEach((number, index) => {
   assert.equal(number, index + 1); 
});

