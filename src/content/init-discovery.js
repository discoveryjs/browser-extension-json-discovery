import { Widget, router, utils } from '@discoveryjs/discovery';
import settingsPage from '../settings';

/**
 * Discovery initialization
 * @param {Object} options
 * @param {Object} data
 * @returns {Discovery}
 */
export function initDiscovery(options, data) {
    const { settings, progressbar } = options;
    const { darkmode = 'auto' } = settings;
    const discovery = new Widget(options.node, null, {
        darkmode,
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
            setTimeout(() => el.remove(), 750);
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
        const { raw } = discovery.context;

        el.textContent = raw;
    }, { tag: 'pre' });

    discovery.page.define('raw', 'raw');
    discovery.on('pageHashChange', () => {
        // FIXME: This doesn't work since styles are in SD. Should be removed?
        document.body.classList.toggle('no-user-select', discovery.pageId === 'raw');
    });

    discovery.nav.append({
        when: () => discovery.pageId !== 'default',
        content: 'text:"Index"',
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
    discovery.nav.append({
        content: 'text:"Save"',
        onClick: el => {
            const blob = new Blob([options.raw], { type: 'application/json' });

            const location = (window.location.hostname + window.location.pathname)
                .replace(/[^a-z0-9]/gi, '-')
                .replace(/-$/, '');
            el.download = location.endsWith('-json') ? location.replace(/-json$/, '.json') : location + '.json';
            el.href = window.URL.createObjectURL(blob);
        }
    });
    discovery.nav.append({
        when: () => discovery.pageId !== 'raw',
        content: 'text:"Raw"',
        onClick: () => discovery.setPage('raw')
    });
    discovery.nav.append({
        when: () => discovery.pageId === 'raw',
        content: 'text:"Copy raw"',
        onClick: async function() {
            const { raw } = discovery.context;

            try {
                await navigator.clipboard.writeText(raw);
            } catch (err) {
                console.error(err); // eslint-disable-line no-console
            }

            discovery.flashMessage('Copied!', 'success');
        }
    });
    discovery.nav.append({
        content: 'text:"Settings"',
        onClick: () => discovery.setPage('settings')
    });

    return discovery.setDataProgress(
        data,
        {
            name: options.title,
            raw: options.raw,
            settings,
            createdAt: new Date().toISOString() // TODO fix in discovery
        },
        progressbar
    );
}
