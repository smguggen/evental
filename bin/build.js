#!/usr/bin/env node

const Convene = require('convene');
const convene = new Convene();
const babel = require("@babel/core");
convene.queue({ src: ['callback', 'event', 'events'] }, 'require')
    .on('writing', (data) => data + '\n', true)
    .on('minify', data => babel.transformSync(data, {
        presets: ["@babel/preset-env"]
    }).code, true)
    .on('merged', convene.minify)
    .merge(process.cwd() + '/dist/evental.js', 'dist');