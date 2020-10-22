module.exports = {
    name: 'JsonDiscovery',
    short_name: 'Json Tool', // eslint-disable-line camelcase
    description: 'Browser extension that changes the way you\'re viewing JSON',
    author: 'exdis',
    manifest_version: 2, // eslint-disable-line camelcase
    icons: { 16: 'icons/16.png', 128: 'icons/128.png' },
    permissions: [
        '<all_urls>',
        'storage'
    ],
    content_scripts: [{ // eslint-disable-line camelcase
        js: ['js/inject.js'],
        css: ['css/inject.css'],
        run_at: 'document_start', // eslint-disable-line camelcase
        matches: ['<all_urls>']
    }],
    offline_enabled: true // eslint-disable-line camelcase
};
