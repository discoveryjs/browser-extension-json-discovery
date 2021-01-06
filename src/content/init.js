/* global ISOLATE_STYLE_MARKER */
/**
 * Initializes extension
 * @param {Function} getSettings
 */
export function init(getSettings) {
    let loaded = document.readyState === 'complete';
    let pre = null;
    let initialPreDisplay = null;

    requestAnimationFrame(function x() {
        if (
            document.body &&
            document.body.firstElementChild &&
            document.body.firstElementChild.tagName === 'PRE' &&
            initialPreDisplay === null
        ) {
            pre = document.body.firstElementChild;
            initialPreDisplay = window.getComputedStyle(pre).display;
            pre.style.display = 'none';
        }

        if (!loaded) {
            requestAnimationFrame(x);
        }

        if (pre !== null && loaded) {
            let json;

            const textContent = pre.textContent.trim();

            if (!textContent.startsWith('{') && !textContent.startsWith('[')) {
                pre.style.display = initialPreDisplay;
                return;
            }

            try {
                json = JSON.parse(textContent);
            } catch (e) {
                pre.style.display = initialPreDisplay;
                console.error(e.message); // eslint-disable-line no-console
            }

            if (!json) {
                pre.style.display = initialPreDisplay;
                return;
            }

            document.body.innerHTML = '';

            document.body.style.margin = 0;
            document.body.style.padding = 0;
            document.body.style.height = '100vh';
            document.body.style.border = 'none';

            const discoveryNode = document.createElement('div');
            discoveryNode.style.height = '100%';
            document.body.appendChild(discoveryNode);

            getSettings(settings => {
                initDiscovery({
                    discoveryNode,
                    raw: textContent,
                    data: json,
                    settings
                });
            });
        }
    });
    window.addEventListener('DOMContentLoaded', () => loaded = true, false);
}

/**
 * Discovery initialization
 * @param {Object} options
 * @returns {Discovery}
 */
export function initDiscovery(options) {
    const { Widget, router, complexViews, utils } = require('@discoveryjs/discovery/dist/discovery.umd.js');
    const settingsPage = require('../settings').default;

    const { settings } = options;
    const { darkmode = 'auto' } = settings;
    const discovery = new Widget(options.discoveryNode, null, {
        isolateStyleMarker: ISOLATE_STYLE_MARKER,
        darkmode
    });

    discovery.apply(router);
    discovery.apply(complexViews);

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

        el.classList.add('user-select');
        el.textContent = raw;
    }, { tag: 'pre' });

    discovery.page.define('raw', 'raw');

    discovery.nav.append({
        content: 'text:"Index"',
        onClick: () => {
            discovery.setPage('default');
            history.replaceState(null, null, ' ');
        },
        when: () => discovery.pageId !== 'default'
    });
    discovery.nav.append({
        content: 'text:"Make report"',
        onClick: () => discovery.setPage('report'),
        when: () => discovery.pageId !== 'report'
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
        content: 'text:"Raw"',
        onClick: () => discovery.setPage('raw'),
        when: () => discovery.pageId !== 'raw'
    });
    discovery.nav.append({
        content: 'text:"Copy raw"',
        onClick: async function() {
            const { raw } = discovery.context;

            try {
                await navigator.clipboard.writeText(raw);
            } catch (err) {
                console.error(err); // eslint-disable-line no-console
            }

            discovery.flashMessage('Copied!', 'success');
        },
        when: () => {
            if (discovery.pageId === 'raw') {
                document.body.classList.add('no-user-select');
            } else {
                document.body.classList.remove('no-user-select');
            }

            return discovery.pageId === 'raw';
        }
    });
    discovery.nav.append({
        content: 'text:"Settings"',
        onClick: () => discovery.setPage('settings')
    });

    discovery.setData(
        options.data,
        {
            name: options.title,
            raw: options.raw,
            settings,
            createdAt: new Date().toISOString() // TODO fix in discovery
        }
    );

    return discovery;
}

/**
 * Restores settings from storage
 * @param {Function} cb
 */
export function getSettings(cb) {
    chrome.storage.sync.get({
        expandLevel: 3,
        darkmode: 'auto'
    }, settings => {
        cb(settings);
    });
}
