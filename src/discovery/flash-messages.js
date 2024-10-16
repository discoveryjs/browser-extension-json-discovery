import { utils } from '@discoveryjs/discovery';

export default function(host) {
    const flashMessagesContainer = utils.createElement('div', 'flash-messages-container');

    host.dom.container.append(flashMessagesContainer);

    host.action.define('flashMessage', async(text, type) => {
        const fragment = document.createDocumentFragment();

        await host.view.render(fragment, {
            view: `alert-${type}`,
            content: 'text'
        }, text);

        const el = fragment.firstChild;

        flashMessagesContainer.append(el);
        setTimeout(() => el.classList.add('ready-to-remove'), 1250);
        setTimeout(() => el.remove(), 1500);
    });
}
