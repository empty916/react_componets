const config = require('./webpack.config.base');
const commonConfig = require('./common_config');
const {
    configEnv,
    configUglify,
    configHtml,
    configCopyFile,
    configBundleAnalyzer,
} = commonConfig;


config.output.publicPath = './';

//压缩js
config.plugins.push(configUglify());

//环境配置
config.plugins.push(configEnv('production',false,false));

//生成html
// Object.keys(config.entry).map((item) => {
//     if (item !== 'vendor') {
//         config.plugins.push(configHtml(item, 'production'));
//     }
//     return false;
// });

// 拷贝dll文件到打包路径
config.plugins.push(configCopyFile());
// config.plugins.push(configBundleAnalyzer());

// 根据index.html为模板生成对应html页面
config.plugins.push(configHtml('index', 'production'));


module.exports = config;