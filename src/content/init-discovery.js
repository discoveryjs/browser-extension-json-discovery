import { Widget, router, utils, navButtons } from '@discoveryjs/discovery';
import settingsPage from '../settings';

/**
 * Discovery initialization
 * @param {Object} options
 * @param {Object} data
 * @returns {Discovery}
 */
export function initDiscovery(options, data) {
    const { settings, progressbar, raw } = options;
    const { darkmode = 'auto' } = settings;
    const discovery = new Widget(options.node, null, {
        inspector: true,
        darkmode,
        darkmodePersistent: false,
        styles: [{ type: 'link', href: chrome.runtime.getURL('index.css') }]
    });
    const copyToClipboard = async function(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error(err); // eslint-disable-line no-console
        }

        discovery.flashMessage('JSON copied to clipboard', 'success');
    };
    const downloadAsFile = function(text) {
        const blob = new Blob([text], { type: 'application/json' });
        const location = (window.location.hostname + window.location.pathname)
            .replace(/[^a-z0-9]/gi, '-')
            .replace(/-$/, '');

        const link = document.body.appendChild(document.createElement('a'));
        link.download = location.endsWith('-json') ? location.replace(/-json$/, '.json') : location + '.json';
        link.href = window.URL.createObjectURL(blob);
        link.click();
        link.remove();
    };
    const renderEl = (config, data, context) => {
        const fragment = document.createDocumentFragment();

        return discovery.view.render(fragment, config, data, context)
            .then(() => fragment.firstChild);
    };

    discovery.apply(router);
    discovery.setPrepare((_, { addQueryHelpers }) => {
        addQueryHelpers({
            weight(current, prec = 1) {
                const unit = ['bytes', 'kB', 'MB', 'GB'];

                while (current > 1000) {
                    current = current / 1000;
                    unit.shift();
                }

                return current.toFixed(prec).replace(/\.0+$/, '') + unit[0];
            }
        });
    });

    discovery.flashMessagesContainer = utils.createElement('div', 'flash-messages-container');
    discovery.dom.container.append(discovery.flashMessagesContainer);
    discovery.flashMessage = (text, type) => {
        renderEl({
            view: `alert-${type}`,
            content: 'text'
        }, text).then((el) => {
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

    discovery.view.define('raw', (el, _, raw) => {
        const contentEl = el.appendChild(document.createElement('pre'));

        contentEl.className = 'content';

        if (raw.firstSlice) {
            contentEl.append(raw.firstSlice);
            discovery.view.render(el, {
                view: 'alert-warning',
                className: 'too-big-json',
                content: [
                    'text:`JSON is too big (${size.weight()} bytes), only first ${firstSlice.size().weight()} is shown. Output the entire JSON may cause to browser freezing for a while. `',
                    {
                        view: 'button',
                        content: 'text:"Show all"',
                        onClick(el) {
                            const alertEl = el.parentNode;
                            alertEl.textContent = 'Output entire JSON...';
                            setTimeout(() => {
                                contentEl.append(raw.json.slice(raw.firstSlice.length));
                                alertEl.remove();
                            }, 50);
                        }
                    }
                ]
            }, raw);
        } else {
            contentEl.append(raw.json);
        }
    });

    discovery.page.define('raw', {
        view: 'context',
        data: () => raw,
        content: [
            {
                view: 'page-header',
                content: [
                    {
                        view: 'button',
                        content: 'text:"Copy to clipboard"',
                        onClick(_, { json }) {
                            copyToClipboard(json);
                        }
                    },
                    {
                        view: 'button',
                        content: 'text:"Download as file"',
                        onClick(_, { json }) {
                            downloadAsFile(json);
                        }
                    }
                ]
            },
            'raw'
        ]
    });

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
    discovery.nav.append({
        when: () => discovery.pageId !== 'raw',
        content: 'text:"JSON"',
        onClick: () => discovery.setPage('raw'),
        postRender(el) {
            el.title = 'Show JSON as is';
        }
    });
    discovery.apply(navButtons.inspect);
    discovery.nav.menu.append({
        content: 'text:"Download JSON as file"',
        onClick: (_, { hide }) => hide() & downloadAsFile(raw.json)
    });
    discovery.nav.menu.append({
        content: 'text:"Copy JSON to clipboard"',
        onClick: (_, { hide }) => hide() & copyToClipboard(raw.json)
    });
    discovery.nav.menu.append({
        content: 'text:"Settings"',
        onClick: (_, { hide }) => hide() & discovery.setPage('settings')
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
