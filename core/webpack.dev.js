const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpack = require('./webpack.base');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = baseWebpack.map(config => merge(config, {
    mode: 'development',
    devtool: 'source-map',
    watch: true,
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new FriendlyErrorsPlugin(),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        })
    ]
}));
