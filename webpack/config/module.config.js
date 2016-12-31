const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const dirs = require('./directories.config.js');

// get real source directories instead of symbol links
let options = { cwd: dirs.sourceRoot, realpath: true };
let sourceDirs = glob.sync('*/', options);
let sourceAndLibDirs = sourceDirs.concat(dirs.nodeModules);

module.exports = {
    preLoaders: [{
        test: /\.(js|jsx)$/,
        include: sourceDirs,
        loader: 'string-replace',
        query: { multiple: require('./module.replace.config.js') }
    }],

    loaders: [
        {
            test: require.resolve('jquery'),
            include: sourceDirs,
            loader: 'expose?$!expose?jQuery'
        },
        {
            test: /\.css$/,
            include: sourceAndLibDirs,
            loader: ExtractTextPlugin.extract('style', 'css')
        },
        {
            test: /\.less$/,
            include: sourceAndLibDirs,
            loader: ExtractTextPlugin.extract('style', 'css!less')
        },
        {
            test: /\.scss/,
            include: sourceAndLibDirs,
            loader: ExtractTextPlugin.extract('style', 'css!sass')
        },
        {
            test: /\.(js|jsx)$/,
            include: sourceAndLibDirs,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react'],
                cacheDirectory: true
            }
        },
        {
            test: /\.json$/,
            include: sourceDirs,
            loader: 'json'
        },
        {
            test: /\.(png|jpg|gif)$/,
            include: sourceAndLibDirs,
            loader: 'url?limit=8192&name=./images/[hash].[ext]'
        },
        {
            test: /\.(svg|ttf|otf|woff|woff2|eot)(\?v=\d+\.\d+\.\d+)?$/,
            include: sourceAndLibDirs,
            loader: 'url?limit=8192&name=./fonts/[name].[ext]'
        }
    ]
};
