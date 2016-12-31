const alias = require('./module.alias.config.js');

let queries = [];
Object.keys(alias).forEach((key) => {
    queries.push({
        search: 'require\\((\\\'|\\\")' + key + '(\\\'|\\\")\\)',
        replace: 'require("' + alias[key] + '")',
        flags: 'gm'
    });

    queries.push({
        search: '(define\\((\\s*(\\\'|\\\")[^\\\'\\\"]+(\\\'|\\\")\\s*,)?\\s*\\[(\\s*(\\\'|\\\")[^\\\'\\\"]+(\\\'|\\\")\\s*,)*)\\s*(\\\'|\\\")' + key + '(\\\'|\\\")',
        replace: '$1 "' + alias[key] + '"',
        flags: 'gm'
    });
});

module.exports = queries;
