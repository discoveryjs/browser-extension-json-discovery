const { bundleCss } = require('@discoveryjs/cli').build;

const isolateOptions = {
    isolate: true
};

/**
 * Css Transform loader
 */
module.exports = function loader() {
    const callback = this.async();

    bundleCss(this.resourcePath, isolateOptions)
        .then(({ content, isolate }) =>
            callback(null, [
                `exports = module.exports = [[module.id, ${JSON.stringify(content)}]];`,
                `module.exports.locals=${JSON.stringify(isolate)};`
            ].join('\n'))
        )
        .catch(error => callback(error));
};
