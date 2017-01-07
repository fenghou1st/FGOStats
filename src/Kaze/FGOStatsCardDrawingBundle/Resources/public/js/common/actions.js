define(function () {
    return (bundleName) => {
        const actions = require('bundles/' + bundleName + '/data/actions.yml');

        return (path) => {
            let acts = actions;

            const keys = path.split('.');
            keys.forEach((key) => {
                if (!(key in acts)) return path;
                acts = acts[key];
            });

            return acts;
        };
    };
});
