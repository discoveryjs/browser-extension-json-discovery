const csstree = require('css-tree');
const { WRAPPER_NODE } = require('./constants');

const walkTree = ast => {
    csstree.walk(ast, {
        visit: 'Rule',
        enter: function(node) {
            // Namespace all discovery styles
            node.prelude.children.forEach(child => {
                child.children.prependData({
                    type: 'WhiteSpace',
                    value: ' '
                });
                child.children.prependData({
                    type: 'ClassSelector',
                    name: WRAPPER_NODE
                });
            });
        }
    });

    return csstree.generate(ast);
};

/**
 * Css Transform loader
 * @param {string} source
 */
module.exports = function(source) {
    const callback = this.async();

    const ast = csstree.parse(source);

    try {
        callback(null, walkTree(ast));
    } catch (error) {
        callback(error);
    }
};
