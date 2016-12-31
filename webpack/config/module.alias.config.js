const path = require('path');

module.exports = {
    'font-awesome': 'font-awesome-webpack!' + path.join(__dirname, 'vendor', 'font-awesome', 'font-awesome.config.js'),
    'bootstrap': 'bootstrap-loader/lib/bootstrap.loader?configFilePath=' + path.join(__dirname, 'vendor', 'bootstrap', '.bootstraprc') + '!bootstrap-loader/no-op.js'
};
