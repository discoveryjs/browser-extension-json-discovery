const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('../package.json');
const manifestBase = require('../src/manifest.js');
const manifestFirefox = require('../src/manifest-firefox.js');

const resolve = dir => path.join(__dirname, '..', 'src', dir);
const config = ({ entry = resolve('./content/inject'), manifest, outputPath, staticCopy = true }) => ({
    target: 'web',
    node: {
        global: false
    },
    entry: {
        inject: entry
    },
    output: {
        path: path.join(__dirname, '..', outputPath),
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
                    },
                    {
                        loader: require.resolve('./cssTransformLoader.js')
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
        new CopyWebpackPlugin([
            ...staticCopy ? [{
                from: path.join(__dirname, '..', 'static')
            }] : [],
            ...manifest ? [{
                from: path.join(__dirname, '..', 'src', 'manifest.js'),
                to: path.join(__dirname, '..', outputPath, 'manifest.json'),
                transform() {
                    manifest.version = pkg.version;
                    return JSON.stringify(manifest, null, 2);
                }
            }] : []
        ]),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ],
    performance: { hints: false }
});

const chromeConfig = config({
    manifest: manifestBase,
    outputPath: 'build-chrome'
});
const firefoxConfig = config({
    manifest: manifestFirefox,
    outputPath: 'build-firefox'
});
const safariConfig = config({
    entry: resolve('./content/inject-safari'),
    outputPath: 'safari/JsonDiscovery/JsonDiscovery Extension',
    staticCopy: false
});

module.exports = [
    chromeConfig,
    firefoxConfig,
    safariConfig
];
