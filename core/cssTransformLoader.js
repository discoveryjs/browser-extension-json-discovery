const csstree = require('css-tree');
const { WRAPPER_NODE } = require('./constants');

const walkTree = ast => {
    csstree.walk(ast, function(node) {
        if (node.type === 'Selector') {
            node.children.prepend(node.children.createItem({
                type: 'WhiteSpace',
                value: ' '
            }));
            node.children.prepend(node.children.createItem({
                type: 'ClassSelector',
                name: WRAPPER_NODE
            }));
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
