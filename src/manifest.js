const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

module.exports = function(browser = 'chrome') {
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json')).toString());

    manifest.version = packageJson.version;

    if (browser === 'firefox') {
        manifest.applications = {
            gecko: {
                id: 'jsondiscovery@exdis.me',
                strict_min_version: '57.0' // eslint-disable-line camelcase
            }
        };

        delete manifest.offline_enabled;
    }

    if (browser === 'firefox') {
        manifest.content_scripts[0].js[0] = 'loader-firefox.js';
    }

    return JSON.stringify(manifest, null, 4);
};
