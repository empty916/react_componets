const config = require('./webpack.config.base');

const commonConfig = require('./common_config');
const {
    configEnv,
    configUglify,
    configHtml,
    configCopyFile,
    configBundleAnalyzer,
} = commonConfig;


// todo: 打包需要打开的配置 start

config.output.publicPath = './';

config.plugins.push(configUglify());

// todo:打包需要打开的配置 end

//环境配置
config.plugins.push(configEnv('test',false,false));

config.plugins.push(configCopyFile());
// config.plugins.push(configBundleAnalyzer());

// 根据index.html为模板生成对应html页面
config.plugins.push(configHtml('index', 'test'));

module.exports = config;