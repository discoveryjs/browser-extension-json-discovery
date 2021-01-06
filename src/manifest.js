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

    if (browser === 'safari') {
        // delete manifest.icons;
        // delete manifest.offline_enabled;
        // delete manifest.content_scripts;
        // delete manifest.version;
        // delete manifest.description;
        // delete manifest.short_name;
        // delete manifest.name;
        // delete manifest.manifest_version;
    }

    return JSON.stringify(manifest, null, 4);
};
