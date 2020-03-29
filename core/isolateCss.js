const { bundleCss } = require('@discoveryjs/cli').build;
const { CSS_ISOLATE_MARKER } = require('../core/constants');

const isolateOptions = {
    isolate: CSS_ISOLATE_MARKER
};

/**
 * Css Transform loader
 * @param {string} source
 */
module.exports = function() {
    const callback = this.async();

    bundleCss(this.resourcePath, isolateOptions)
        .then(({ content }) => callback(null, content))
        .catch(error => callback(error));
};
