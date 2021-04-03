import { utils } from '@discoveryjs/discovery';

const flashMessagesContainer = utils.createElement('div', 'flash-messages-container');
let renderEl;

export default function(host) {
    host.dom.container.append(flashMessagesContainer);
    renderEl = (config, data, context) => {
        const fragment = document.createDocumentFragment();

        return host.view.render(fragment, config, data, context)
            .then(() => fragment.firstChild);
    };
}

export function flashMessage(text, type) {
    if (typeof renderEl !== 'function') {
        return;
    }

    renderEl({
        view: `alert-${type}`,
        content: 'text'
    }, text).then((el) => {
        flashMessagesContainer.append(el);
        setTimeout(() => el.classList.add('ready-to-remove'), 1250);
        setTimeout(() => el.remove(), 1500);
    });
}
