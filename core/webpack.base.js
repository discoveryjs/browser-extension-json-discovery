const path = require('path');
const { htmlPage } = require('./tools');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('../package.json');
const manifest = require('../src/manifest.js');

const resolve = dir => path.join(__dirname, '..', 'src', dir);
module.exports = {
    target: 'web',
    node: {
        global: false
    },
    entry: {
        content: resolve('./content'),
        inject: resolve('./content/inject'),
        settings: resolve('./settings')
    },
    output: {
        path: path.join(__dirname, '..', 'build'),
        publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].[name].js?[hash]',
        library: '[name]'
    },
    stats: {
        children: false
    },
    resolve: {
        extensions: ['.js', '.json'],
        modules: [
            path.join(process.cwd(), 'node_modules/@avito/discovery/client/'),
            path.join(process.cwd(), 'node_modules')
        ]
    },
    module: {
        // noParse: /node_modules\/@avito\/discovery\/dist\/lib\.js/,
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            import: true
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                    }
                }],
                include: [path.join(__dirname, '..', 'src'), path.join(__dirname, '..', 'test')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        htmlPage('content', 'content', ['content']),
        htmlPage('DiscoveryJSON Settings', 'settings', ['settings'], './core/settings.ejs'),
        new CopyWebpackPlugin([{ from: path.join(__dirname, '..', 'static') }]),
        new WebpackExtensionManifestPlugin({
            config: {
                base: manifest,
                extend: { verion: pkg.verion }
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css'
        })
    ],
    performance: { hints: false }
};
