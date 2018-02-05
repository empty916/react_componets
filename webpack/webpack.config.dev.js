const config = require('./webpack.config.base');

const commonConfig = require('./common_config');
const { configEnv, configHtml, configSprite } = commonConfig;

// config.devtool = 'cheap-module-eval-source-map';

//环境配置
config.plugins.push(configEnv('dev',false,false));
// 生成雪碧图
// config.plugins.push(configSprite());

// 根据index.html为模板生成对应html页面
config.plugins.push(configHtml('index', 'dev'));

module.exports = config;