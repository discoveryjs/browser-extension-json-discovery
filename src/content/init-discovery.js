import { Widget, router, utils, navButtons } from '@discoveryjs/discovery';
import settingsPage from '../settings';

/**
 * Discovery initialization
 * @param {Object} options
 * @param {Object} data
 * @returns {Discovery}
 */
export function initDiscovery(options, data) {
    const { settings, progressbar, getRaw } = options;
    const { darkmode = 'auto' } = settings;
    const discovery = new Widget(options.node, null, {
        inspector: true,
        darkmode,
        darkmodePersistent: false,
        styles: [{ type: 'link', href: chrome.runtime.getURL('index.css') }]
    });

    discovery.apply(router);

    discovery.flashMessagesContainer = utils.createElement('div', 'flash-messages-container');
    discovery.dom.container.append(discovery.flashMessagesContainer);
    discovery.flashMessage = (text, type) => {
        const fragment = document.createDocumentFragment();

        discovery.view.render(fragment, {
            view: `alert-${type}`,
            content: 'text'
        }, text).then(() => {
            const el = fragment.firstChild;

            discovery.flashMessagesContainer.append(el);
            setTimeout(() => el.classList.add('ready-to-remove'), 1250);
            setTimeout(() => el.remove(), 1500);
        });
    };

    settingsPage(discovery);

    discovery.page.define('default', [
        {
            view: 'struct',
            expanded: '=+#.settings.expandLevel'
        }
    ]);

    discovery.view.define('raw', el => {
        el.textContent = getRaw();
    }, { tag: 'pre' });

    discovery.page.define('raw', 'raw');

    discovery.nav.append({
        when: () => discovery.pageId !== 'default',
        content: 'text:"Default view"',
        onClick: () => {
            discovery.setPage('default');
            history.replaceState(null, null, ' ');
        }
    });
    discovery.nav.append({
        when: () => discovery.pageId !== 'report',
        content: 'text:"Make report"',
        onClick: () => discovery.setPage('report')
    });
    discovery.apply(navButtons.inspect);
    discovery.nav.menu.append({
        content: 'text:"Download JSON"',
        onClick: el => {
            const blob = new Blob([getRaw()], { type: 'application/json' });
            const location = (window.location.hostname + window.location.pathname)
                .replace(/[^a-z0-9]/gi, '-')
                .replace(/-$/, '');

            el.download = location.endsWith('-json') ? location.replace(/-json$/, '.json') : location + '.json';
            el.href = window.URL.createObjectURL(blob);
        }
    });
    discovery.nav.append({
        when: () => discovery.pageId !== 'raw',
        content: 'text:"JSON"',
        onClick: () => discovery.setPage('raw'),
        postRender(el) {
            el.title = 'Show JSON as is';
        }
    });
    discovery.nav.menu.append({
        content: 'text:"Copy JSON to clipboard"',
        onClick: async function() {
            try {
                await navigator.clipboard.writeText(getRaw());
            } catch (err) {
                console.error(err); // eslint-disable-line no-console
            }

            discovery.flashMessage('Copied!', 'success');
        }
    });
    discovery.nav.menu.append({
        content: 'text:"Settings"',
        onClick: () => discovery.setPage('settings')
    });

    return discovery.setDataProgress(
        data,
        {
            name: options.title,
            settings,
            createdAt: new Date().toISOString() // TODO fix in discovery
        },
        progressbar
    );
}
