module.exports = {
    name: 'JsonDiscovery',
    short_name: 'Json Tool', // eslint-disable-line camelcase
    description: 'Browser extension for viewing JSON documents and making reports on the fly.',
    author: 'exdis',
    manifest_version: 2, // eslint-disable-line camelcase
    icons: { 16: 'icons/16.png', 128: 'icons/128.png' },
    permissions: [
        '<all_urls>',
        'storage'
    ],
    content_scripts: [{ // eslint-disable-line camelcase
        js: ['js/inject.js'],
        run_at: 'document_end', // eslint-disable-line camelcase
        matches: ['<all_urls>']
    }]
};
