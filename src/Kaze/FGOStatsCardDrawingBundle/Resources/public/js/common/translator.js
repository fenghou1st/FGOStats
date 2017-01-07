define(function () {
    return (bundleName) => {
        const translations = require('bundles/' + bundleName + '/data/translations.yml');

        return (path) => {
            let trans = translations;

            const keys = path.split('.');
            keys.forEach((key) => {
                if (!(key in trans)) return path;
                trans = trans[key];
            });

            return trans;
        };
    };
});
