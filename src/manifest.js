module.exports = {
    name: 'JsonDiscovery',
    short_name: 'Json Tool', // eslint-disable-line camelcase
    description: 'Extension for discovery json APIs and data',
    author: 'exdis',
    manifest_version: 2, // eslint-disable-line camelcase
    icons: { 16: 'icons/16.png', 128: 'icons/128.png' },
    permissions: [
        'activeTab',
        'storage'
    ],
    options_ui: { // eslint-disable-line camelcase
        page: 'pages/settings.html',
        chrome_style: true, // eslint-disable-line camelcase
        open_in_tab: false // eslint-disable-line camelcase
    },
    content_scripts: [{ // eslint-disable-line camelcase
        js: ['js/inject.js'],
        run_at: 'document_end', // eslint-disable-line camelcase
        matches: ['<all_urls>'],
        all_frames: true // eslint-disable-line camelcase
    }],
    content_security_policy: 'script-src \'self\' \'unsafe-eval\'; object-src \'self\'', // eslint-disable-line camelcase
    web_accessible_resources: ['js/jora.js', 'js/content.js', 'css/content.css', 'pages/content.html', 'pages/settings.html'] // eslint-disable-line camelcase
};
