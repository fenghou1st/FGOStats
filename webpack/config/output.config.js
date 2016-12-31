const dirs = require('./directories.config.js');

module.exports = {
    path: dirs.dist,
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[id].bundle.js',
};
