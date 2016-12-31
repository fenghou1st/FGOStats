const path = require('path');
const dirs = require('./directories.config.js');

module.exports = {
    alias: {
        bundles: dirs.sourceRoot,
    },

    extensions: ['', '.js']
};
