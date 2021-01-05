const packageJson = require('../package.json');

module.exports = function(browser = 'chrome') {
    const manifest = {
        version: packageJson.version,
        name: 'JsonDiscovery',
        short_name: 'JsonDiscovery', // eslint-disable-line camelcase
        description: 'Browser extension that changes the way you\'re viewing JSON',
        author: 'exdis',
        manifest_version: 2, // eslint-disable-line camelcase
        icons: {
            16: 'icons/16.png',
            48: 'icons/48.png',
            128: 'icons/128.png'
        },
        permissions: [
            '<all_urls>',
            'storage'
        ],
        content_scripts: [{ // eslint-disable-line camelcase
            js: ['inject.js'],
            css: ['index.css'],
            run_at: 'document_start', // eslint-disable-line camelcase
            matches: ['<all_urls>']
        }],
        offline_enabled: true // eslint-disable-line camelcase
    };

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
