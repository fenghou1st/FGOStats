const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const dirs = require('../config/directories.config.js');

// clear dist files and create dummy commons.css
rimraf(dirs.dist, fs, () => {
    console.log('Dist files cleared');

    fs.mkdir(dirs.dist, 0o775, () => {
        const cssFile = path.join(dirs.dist, 'commons.css');

        fs.open(cssFile, 'wx', (err, fd) => {
            if (err) {
                console.error('Failed to create dummy commons.css file!');
            }
            else {
                fs.close(fd);
                console.log('Created dummy commons.css file');
            }
        });
    });
});
