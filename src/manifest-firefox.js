const manifest = require('./manifest');

const ffManifest = Object.assign({}, manifest, {
    applications: {
        gecko: {
            id: 'jsondiscovery@exdis.me',
            strict_min_version: '57.0' // eslint-disable-line camelcase
        }
    }
});

delete ffManifest.offline_enabled;

module.exports = ffManifest;
