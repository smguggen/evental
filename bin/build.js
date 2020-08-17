#!/usr/bin/env node

module.exports = function() {
    const Convene = require('convene');
    const convene = new Convene();
    const babel = require("@babel/core");
    convene.queue({ src: ['callback', 'event', 'events'] }, 'require')
        .on('writing', (data) => data + '\n', true)
        .on('minify', data => babel.transformSync(data, {
            presets: ["@babel/preset-env"]
        }).code, true)
        .on('clear', () => {
            convene.requeue({ src: ['callback', 'event', 'events'] }, 'require')
                .on('writing', data => {
                    data = data + '\n\n'; 
                    if (data.startsWith('class Evental {')) {
                        data += 'export default Evental;';
                    }
                    return data;
                }, true)
                .merge(process.cwd() + '/dist/evental.es.js', true)
        })
        .on('merged', convene.minify)
        .merge(process.cwd() + '/dist/evental.js', 'dist');
}