module.exports = {
    entry: require('./config/entry.config.js'),

    output: require('./config/output.config.js'),

    module: require('./config/module.config.js'),

    resolve: require('./config/resolve.config.js'),

    plugins: require('./config/plugins.dev.config.js')
};
