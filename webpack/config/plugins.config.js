const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const dirs = require('./directories.config.js');

module.exports = [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'commons',
        filename: '[name].js',
        minChunks: 4
    }),
    new ExtractTextPlugin('[name].css'),
    new webpack.DllReferencePlugin({
        manifest: require('../manifest.json'),
        context: dirs.webpack
    })
];
