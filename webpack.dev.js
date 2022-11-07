
const merge = require('webpack-merge');
const argv = require('yargs').argv;
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode:'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 8099,
        open: false,
        host:'0.0.0.0',
        progress: true, // 打包过程中的进度条
        noInfo: false, // 隐藏bundle信息
        historyApiFallback: true,
        proxy: { // 代理
            '/apioet':{
                target: 'https://localhost:8092/apioet',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/apioet': ''
                }
            }
        },
    },
    plugins: [
        // 热更新插件
        new webpack.HotModuleReplacementPlugin(),
    ]
})
