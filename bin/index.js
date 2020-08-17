#!/usr/bin/env node

const build = require('./build');
const test = require('./test');
const { exec } = require('child_process');
const [a,b,...args] = process.argv;

const cmd = args.shift();

switch(cmd) {
    case 'build': build();
    break;
    case 'test': test();
    break;
}
