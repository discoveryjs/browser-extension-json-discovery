const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpack = require('./webpack.base');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(baseWebpack, {
    mode: 'production',
    devtool: false,
    optimization: {
        minimizer: [new TerserPlugin()]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new webpack.HashedModuleIdsPlugin()
    ]
});
