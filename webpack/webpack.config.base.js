const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const {
    distDirName,
    configCommonChunk,
    configCompress,
    configHappyPack,
    configManifest,
} = require('./common_config');

const exclude = /(node_modules|cache)\//;
const include = /(src)\//;

const getPath = (pathStr) => path.resolve(__dirname,pathStr);


/**
 * 获取本机ip地址
 * @returns {*} ip地址 string
 */
function getIPAdress(){
    let interfaces = require('os').networkInterfaces();
    for(let devName in interfaces){
        let iface = interfaces[devName];
        for(let i=0;i<iface.length;i++){
            let alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}


// 不需要转化为base64编码的图片正则

module.exports = {
    entry: {
        index: getPath('../src/index.js'),
    },
    devServer: {
        open: true,
        inline: true,
        compress: true,
        host: getIPAdress(),
        // profile: true,
    },
    output: {
        path: getPath('../assets'),
        filename:'js/[name].[chunkhash:8].js',
        chunkFilename:'js/[name].[chunkhash:8].chunk.js',	//为按需加载的文件命名／require.ensure([]...
        publicPath: '/',
    },
    module:{
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude,
                // include,
                use: ['happypack/loader?id=babel'],
            },
            {
                test: /\.css$/,
                // exclude,
                include,
                use: ExtractTextPlugin.extract({
                    use: ['happypack/loader?id=css'],
                    publicPath: '../',
                }),
            },
            {
                test: /\.scss$/,
                exclude,
                // include,
                use: ExtractTextPlugin.extract({
                    use: ['happypack/loader?id=scss'],
                    publicPath: '../',
                }),
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'images/[name].[hash:8].[ext]',
                        }
                    },
                ],
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)$/,
                exclude,
                use: [
                    {
                        loader: 'file-loader?name=fonts/[name].[hash:8].[ext]',
                    },
                ],
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss', ' '],
        mainFields: ['jsnext:main', 'browser', 'main'],
        alias: {//注册路径,减少../
            '@utils': getPath('../src/utils'),
            '@images': getPath('../src/images'),
            '@config': getPath('../src/config'),
        },
    },
    plugins: [

        new webpack.DllReferencePlugin({
            manifest: require(`${distDirName}/vendors.dll.json`),
        }),

        new ExtractTextPlugin({
            filename: 'stylesheet/[name].[contenthash:8].css',
            disable: false,
            allChunks: true,
        }),
        // 使用happypack多进程执行babel-loader，css-loader，scss-loader
        ...configHappyPack('babel,css,scss'),
        // 将公共模块抽出，独立打包，避免各个页面重复引用
        configCommonChunk('index'),

        //在 plugin 中添加
        configCompress(), //gzip 压缩
        configManifest(),
        // new ManifestPlugin(),

    ],
};