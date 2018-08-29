'use strict';
var extend = require('xtend');
var webpack = require('webpack');

var common = require('./webpack.common');

module.exports = extend(common.basics, {
    // mode: 'development',
    mode: 'none',
    // devtool: 'eval',
    entry: [
        // 'webpack-dev-server/client?http://0.0.0.0:3000',
        // 'webpack/hot/only-dev-server',
        './demos/index',
    ],
    output: {
        path: __dirname,
        filename: 'bundle.js',
        publicPath: '/demos/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin({}),
    ],   
    module: {
        rules: common.rules.concat([{
            test: /\.jsx?$/,
            use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env', '@babel/preset-react']
                },
              },
            exclude: /node_modules/                          
        }])
    }
});
