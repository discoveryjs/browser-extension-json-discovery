const csstree = require('css-tree');
const { WRAPPER_NODE, POPUP_NODE } = require('./constants');

const walkTree = ast => {
    csstree.walk(ast, {
        visit: 'Rule',
        enter: function(node) {
            if (node.prelude.children.some(item =>
                item.children.some(child =>
                    child.type === 'ClassSelector' && child.name.startsWith(POPUP_NODE)
                )
            )) {
                return;
            }
            node.prelude.children.forEach(child => {
                child.children.prepend(child.children.createItem({
                    type: 'WhiteSpace',
                    value: ' '
                }));
                child.children.prepend(child.children.createItem({
                    type: 'ClassSelector',
                    name: WRAPPER_NODE
                }));
            });

            const nodeCopy = csstree.clone(node);

            const copy = nodeCopy.prelude.children.map(item => {
                item.children = item.children.map(child => {
                    if (child.name === WRAPPER_NODE) {
                        child.name = POPUP_NODE;
                    }

                    return child;
                });

                return item;
            });

            node.prelude.children.prependList(copy);
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
