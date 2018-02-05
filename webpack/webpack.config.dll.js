const path = require('path');
const webpack = require('webpack');

const {
    distDirName,
    configUglify,
    configCompress,
    configHappyPack,
} = require('./common_config');

const getPath = (pathStr) => path.resolve(__dirname,pathStr);

module.exports = {
    entry: {
        vendors: [
            'es6-promise',
            'react',
            'react-dom',
            'classnames',
            'prop-types',
        ],
    },
    output: {
        path: getPath(distDirName),
        filename: '[name].[chunkhash:8].dll.js',
        library: '[name]_[chunkhash:8]',
    },
    module:{
        rules: [
            {
                test: /\.js$/,
                use: ['happypack/loader?id=babel'],
            },
        ]
    },
    plugins: [
        new webpack.DllPlugin({
            path: getPath(`${distDirName}/vendors.dll.json`),
            name: '[name]_[chunkhash:8]',
        }),
        ...configHappyPack('babel'),
        configUglify('../cache/lib'),
        configCompress(),
    ],
};