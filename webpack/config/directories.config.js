const path = require('path');
let dirs = {};

dirs.projectRoot = path.join(__dirname, '..', '..');
dirs.nodeModules = path.join(dirs.projectRoot, 'node_modules');
dirs.webpack = path.join(dirs.projectRoot, 'webpack');
dirs.sourceRoot = path.join(dirs.projectRoot, 'web', 'bundles');
dirs.dist = path.join(dirs.projectRoot, 'web', 'dist');
dirs.dll = path.join(dirs.projectRoot, 'web', 'dll');

module.exports = dirs;
