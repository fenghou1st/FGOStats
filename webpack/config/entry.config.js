const path = require('path');
const glob = require('glob');
const dirs = require('./directories.config.js');

let options = { cwd: dirs.sourceRoot };
let entries = glob.sync('*/js/**/main.js?(x)', options);

let configEntry = {};
entries.forEach((entry) => {
    let found = entry.match(/^([^/]+)\/js\/(.+)\/main\.js(x)?$/);
    console.assert(found && found.length > 0, 'Malformed entry path: %s', entry);

    let name = found[1] + '/' + found[2];
    configEntry[name] = path.join(dirs.sourceRoot, entry);
});

module.exports = configEntry;
