const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpack = require('./webpack.base');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// TODO multiple configurations broken https://github.com/webpack/webpack-cli/issues/887

const config = {
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
};

module.exports = function({ target }) {
    return merge(baseWebpack[target], config);
};
