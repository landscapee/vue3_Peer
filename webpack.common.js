
const path = require('path');
const argv = require('yargs').argv;
const _ = require('lodash');
// monaco-edit
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('vue-html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

let html_webpack_plugin;
 const HtmlWebpackPluginConfig = {
    title: '',
    template: path.resolve(__dirname, './index.hbs'),
    filename: 'index.html',
    vue: true,
    hash: true
}
html_webpack_plugin = new HtmlWebpackPlugin(_.extend(HtmlWebpackPluginConfig, {title: '射线追踪定位系统'}));

function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    entry: [
         path.resolve(__dirname, './index.js')
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[chunkhash].bundle.js',
        chunkFilename: '[name].[chunkhash].chunk.js',
        publicPath: '/',
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'),   resolve('index.js')]
            },
            {
                test: /\.worker\.js$/,
                use: { loader: "worker-loader" },
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: "javascript/auto",
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                include: [resolve('src/icons/svg')],
                options: {
                  symbolId: 'icon-[name]'
                }
            },
            {
                test: /\.scss|.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },

                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                exclude: [resolve('src/icons')],
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: '[name].[ext]'
                    }
                }
            },
            {
                test: /\.hbs$/,
                use: [
                    {loader: 'handlebars-loader'}
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                exclude: [resolve('src/icons')]
            },

        ]
    },
    node:{
        fs: "empty"
    },
    plugins: [
        new VueLoaderPlugin(),
        new ExtractTextPlugin({
            filename:'[name].styles.css',
            allChunks:true
        }),
        // 添加静态资源打包
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'static'),
                to: 'static',
                ignore: ['.*']
            }
        ]),

         html_webpack_plugin,
        new webpack.DefinePlugin({
            PROGRAM: JSON.stringify(argv.Program)
        }),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),

    ],
    resolve: {
        // modules: ['node_modules', 'src', 'static', 'worker'],
        extensions:['.js',".mjs",'.vue'], // 后缀省略设置
        alias: {
            'vue$': 'vue/dist/vue.esm-bundler.js',
            '@': resolve('src'),
            '@views': resolve('src/views'),
        }
    }
}
