const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const dirs = require('../config/directories.config.js');

// clear dll files and create dummy dll.css
rimraf(dirs.dll, fs, () => {
    console.log('Dll files cleared');

    fs.mkdir(dirs.dll, 0o775, () => {
        const cssFile = path.join(dirs.dll, 'dll.css');

        fs.open(cssFile, 'wx', (err, fd) => {
            if (err) {
                console.error('Failed to create dummy dll.css file!');
            }
            else {
                fs.close(fd);
                console.log('Created dummy dll.css file');
            }
        });
    });
});
