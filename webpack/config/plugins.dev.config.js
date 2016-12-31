const webpack = require('webpack');
let pluginsConfig = require('./plugins.config.js');

pluginsConfig.push(new webpack.DefinePlugin({ __DEV__: true, __PROD__: false }));

module.exports = pluginsConfig;
