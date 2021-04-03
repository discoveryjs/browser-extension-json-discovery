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

    const btnCopyToClipboard = {
        view: 'button',
        content: 'text:"Copy to clipboard"',
        onClick(_, { json }) {
            copyToClipboard(json);
        }
    };
    const btnDownload = {
        view: 'button',
        content: 'text:"Download as file"',
        onClick(_, { json }) {
            downloadAsFile(json);
        }
    };

    discovery.page.define('default', {
        view: 'context',
        modifiers: {
            view: 'page-header',
            content: [
                btnCopyToClipboard,
                btnDownload,
                {
                    view: 'block',
                    content: [
                        {
                            view: 'button',
                            className: 'collapse-all',
                            content: 'text:"-"',
                            onClick(el, data, { onChange }) {
                                onChange(1, 'expandLevel');
                            },
                            postRender(el, config, data, context) {
                                context.onChange = config.onChange;
                                el.title = 'Collapse all';
                                el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">' +
                                    '<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z"/>' +
                                    '</svg>';
                            }
                        },
                        {
                            view: 'button',
                            className: 'expand-all',
                            content: 'text:"+"',
                            onClick(el, data, { onChange }) {
                                onChange(100, 'expandLevel');
                            },
                            postRender(el, config, data, context) {
                                context.onChange = config.onChange;
                                el.title = 'Expand all';
                                el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">' +
                                    '<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z"/>' +
                                    '</svg>';
                            }
                        }
                    ]
                }
            ]
        },
        content: {
            view: 'struct',
            expanded: '=+(#.expandLevel or #.settings.expandLevel)'
        }
    });

    discovery.view.define('raw', (el, _, raw) => {
        const contentEl = el.appendChild(document.createElement('pre'));

        contentEl.className = 'content';

        if (raw.firstSlice) {
            contentEl.append(raw.firstSlice);
            discovery.view.render(el, {
                view: 'alert-warning',
                className: 'too-big-json',
                content: [
                    'text:`JSON is too big (${size.weight()} bytes), only first ${firstSlice.size().weight()} is shown. Output the entire JSON may cause to browser\'s tab freezing for a while. `',
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
                    btnCopyToClipboard,
                    btnDownload
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
