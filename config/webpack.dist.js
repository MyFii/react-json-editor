'use strict';
var extend = require('xtend');
var path = require('path');


var common = require('./webpack.common.dist');


module.exports = extend(common, {
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'react-json-editor.js',
        libraryTarget: 'umd',
        library: 'react-json-editor',
    },
});
