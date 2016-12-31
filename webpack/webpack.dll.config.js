const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const dirs = require('./config/directories.config.js');

module.exports = {
    entry: {
        dll: require('./config/dll.config.js')
    },
    output: {
        path: dirs.dll,
        filename: '[name].js',
        library: '[name]'
    },
    module: require('./config/module.config.js'),
    resolve: require('./config/resolve.config.js'),
    plugins: [
        new webpack.DllPlugin({
            path: path.join(dirs.webpack, 'manifest.json'),
            name: '[name]',
            context: dirs.webpack,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
        new ExtractTextPlugin('[name].css'),
    ],
};
