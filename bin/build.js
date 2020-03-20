#!/usr/bin/env node

const Convene = require('convene');
const convene = new Convene();
const babel = require("@babel/core");
convene.on('writing', data => babel.transformSync(data, {
    presets: ["@babel/preset-env"]
  }).code , true);
convene.require(['events'], 'src');
convene.merge('events', 'dist', true);