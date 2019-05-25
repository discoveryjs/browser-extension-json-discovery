const manifest = require('./manifest');

module.exports = Object.assign({}, manifest, {
    applications: {
        gecko: {
            id: 'jsondiscovery@exdis.me',
            strict_min_version: '57.0' // eslint-disable-line camelcase
        }
    }
});
