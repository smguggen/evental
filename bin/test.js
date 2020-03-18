#!/usr/bin/env node

const assert = require('assert');
const events = require('../index').instance;

let tester = 1;

let callback1 = events.on('test', number => {
    assert.equal(tester, number);
    tester = 2;
});
assert.equal(tester, 1);

let callback2 = events.on('test', number => {
    assert.equal(number, 1);
    assert.equal(tester, 2);
    tester = 1; 
});
assert.notEqual(callback1, callback2);
events.fire('test', tester);
assert.equal(tester, 1);

events.off('test', callback2);
events.fire('test', tester);
assert.equal(tester, 2);
let calced = events.calc('test', tester);
assert.equal(calced, null);
events.on('test', number => {
    return number + 5;
}, true);
calced = events.calc('test', tester);
assert.equal(calced, 7);