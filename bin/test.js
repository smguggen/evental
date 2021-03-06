#!/usr/bin/env node
module.exports = function() {
    const assert = require('assert');
    const evental = require('../index').instance;
    let tester = 1;

    let callback1 = evental.on('test', number => {
        assert.strictEqual(tester, number);
        tester = 2;
    });
    assert.strictEqual(tester, 1);

    let callback2 = evental.on('test', number => {
        assert.strictEqual(number, 1);
        assert.strictEqual(tester, 2);
        tester = 1; 
    });
    assert.notStrictEqual(callback1, callback2);
    evental.fire('test', tester);
    assert.strictEqual(evental.count('test'), 1);
    assert.strictEqual(tester, 1);

    evental.off('test', callback2);
    evental.fire('test', tester);
    assert.strictEqual(evental.count('test'), 2);
    assert.strictEqual(tester, 2);
    let calced = evental.calc('test', tester);
    assert.strictEqual(evental.count('test'), 3);
    assert.strictEqual(calced, undefined);
    evental.on('test', number => {
        return number + 5;
    }, true);
    calced = evental.calc('test', tester);
    assert.strictEqual(evental.count('test'), 4);
    assert.strictEqual(calced, 7);
    evental.reset();
    assert.ok(evental.length == 0, 'Evental object failed to reset');
    let obj = {
        count: 19
    }
    evental.setCaller(obj);
    evental.on('test', function() {
        assert.strictEqual(this.count, 19);
    });
    evental.fire('test');
    assert.strictEqual(evental.count('test'), 5);
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
    assert.strictEqual(number, index + 1); 
    });

    assert.strictEqual(evental.count('one'), 0);

    evental.fire(['one', 'two']);

    assert.strictEqual(evental.count('one'), 1);
    assert.strictEqual(evental.count('two'), 1);

    evental.setCaller(evental);

    evental.on('three', function(number) {
        switch(this.count('three')) {
            case 1: assert.strictEqual(number, 1);
            break;
            case 2: assert.strictEqual(number, 2);
            break;
            case 3: assert.strictEqual(number, 1);
            break;
            case 4: assert.strictEqual(number, 1);
            break;
        }
    });

    evental.fire('three', 1);
    evental.onCalc('three', number => {
    return (number || 0) + 1; 
    });
    evental.fire('three', 1);
    evental.fire('three');
    evental.get('three').bypass();
    evental.fire('three', 1);

    let newNumber = 1;
    let tempFn = evental.one('temp', number => {
        newNumber += number;
    });

    evental.fire('temp', 1);
    evental.fire('temp', 1);
    assert.strictEqual(newNumber, 2);
    evental.one('temp', tempFn);
    evental.fire('temp', 1);
    evental.fire('temp', 1);
    assert.strictEqual(newNumber, 3);
}