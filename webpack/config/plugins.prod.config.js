const webpack = require('webpack');
let pluginsConfig = require('./plugins.config.js');

pluginsConfig.push(new webpack.DefinePlugin({ __DEV__: false, __PROD__: true }));

pluginsConfig.push(new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }));

pluginsConfig.push(new webpack.optimize.OccurenceOrderPlugin());

pluginsConfig.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }));

pluginsConfig.push(new webpack.NoErrorsPlugin());

module.exports = pluginsConfig;
