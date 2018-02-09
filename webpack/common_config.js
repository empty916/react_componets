const path = require('path');
const webpack = require('webpack');
// webpack 3.x 变量提升功能
// const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
const SpritesmithPlugin = require('webpack-spritesmith');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HappyPack = require("happypack");

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


// const distDirName = '../assets/js';
const distDirName = '../cache/js';
const getPath = (pathStr) => path.resolve(__dirname,pathStr);

module.exports = {
    distDirName: distDirName,
    configEnv: (env,devtool,debug) => new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(env),
        },
        __DEVTOOLS__: devtool || false,
        __DEBUG__: debug || false,
    }),
    configUglify: (path) => new ParallelUglifyPlugin({ //压缩js
        cacheDir: getPath(path || '../cache'),
        uglifyJS: {
            output: {
                beautify: false,
                comments: false,
            },
            compress: {
                warnings: false,
                drop_console: true,
                drop_debugger: true,
                collapse_vars: true,
                reduce_vars: true,
            },
        },
    }),
    configHtml: (item, env) => {
        const dev = `/${distDirName.replace('../','')}`;
        const dist = `./js`;
        const libPath = env === 'dev' ? dev : dist;

        return new HtmlWebpackPlugin({
            template: getPath(`../src/${item}.html`),
            filename: `${item}.html`,
            inject: true,
            minify: {
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
                conservativeCollapse: true,
                removeComments: true,
            },
            dll: (()=>{
                const dllName = require(`${distDirName}/vendors.dll.json`).name.split('_');
                return `${libPath}/${dllName[0]}.${dllName[1]}.dll.js`
            })(),
        })
    },
    configCommonChunk: (name) => new webpack.optimize.CommonsChunkPlugin({
        name,
        minChunks: 2,
        children: true,
    }),
    configCompress: () => new CompressionWebpackPlugin({ //gzip 压缩
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.css$/,
        threshold: 10240,
        minRatio: 0.8
    }),
    configHappyPack: (loaderNames) => {
        const plugins = [];
        // const happyThreadPool = HappyPack.ThreadPool({ size: 1 });
        const threads = 1;
        if(loaderNames.indexOf('babel') > -1) {
            plugins.push(new HappyPack({
                id: 'babel',
                threads: threads,
                // threadPool: happyThreadPool,
                loaders: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                "es2015",
                                'react',
                                'stage-0',
                            ],
                            plugins: [
                                ["transform-runtime", {
                                    "helpers": false,
                                    "polyfill": false,
                                }],	//运行时编译
                                'add-module-exports',
                                "transform-decorators-legacy"
                            ],
                        }
                    }
                ]
            }));
        }
        if(loaderNames.indexOf('css') > -1) {
            plugins.push(new HappyPack({
                id: 'css',
                threads: threads,
                loaders: [
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            minimize: true,
                        }
                    },
                    'postcss-loader',
                ]
            }));
        }
        if(loaderNames.indexOf('scss') > -1) {
            plugins.push(new HappyPack({
                id: 'scss',
                threads: threads,
                loaders: [
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            minimize: true,
                        }
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            // sourceMap: true,
                            outputStyle: 'compact',
                        },
                    },
                ]
            }));
        }
        return plugins;
    },
    configManifest: () => new ManifestPlugin(),
    configSprite:(env) => {
        // const dev = `/h5_divide/${distDirName.split('/')[1]}/images`;
        // const dist = `../images`;
        // const libPath = env === 'dev' ? dev : dist;
        const libPath = '../../images';

        return new SpritesmithPlugin({
            // 目标小图标
            src: {
                cwd: getPath('../src/images/bank_logo/'),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: getPath('../cache/sprite/sprite.png'),
                css: getPath('../cache/sprite/sprite.scss')
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: `${libPath}/sprite.png`
            },
            spritesmithOptions: {
                algorithm: 'top-down'
            }
        });
    },
    // configScopeHoisting:() => new ModuleConcatenationPlugin(),
    /**
     * 将dll文件拷贝到打包目录文件中去
     * @param option
     */
    configCopyFile: option => new CopyWebpackPlugin([{
        from: getPath('../cache/js/*'),
        to: getPath('../assets/js'),
        flatten: true,
    }], {
        ignore: ['*.json'],
    }),
    configBundleAnalyzer: () => new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true,
        statsFilename: 'bundle-stats.json',
    }),
};