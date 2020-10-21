/**
 * Initializes extension
 * @param {Function} getSettings
 */
export async function init(getSettings) {
    let json;

    const { firstElementChild } = document.body;

    if (!firstElementChild || firstElementChild.tagName !== 'PRE') {
        return;
    }

    const textContent = firstElementChild.textContent.trim();

    if (!textContent.startsWith('{') && !textContent.startsWith('[')) {
        return;
    }

    try {
        json = JSON.parse(textContent);
    } catch (e) {
        console.error(e.message); // eslint-disable-line no-console
    }

    if (!json) {
        return;
    }

    const raw = document.body.innerHTML;

    document.body.innerHTML = '';

    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.height = '100%';
    document.body.style.border = 'none';
    document.body.style.webkitTextSizeAdjust = '100%';
    document.body.style['background-color'] = '#fff';

    const discoveryNode = document.createElement('div');
    discoveryNode.style.height = '100%';
    document.body.appendChild(discoveryNode);

    getSettings(settings => {
        initDiscovery({
            discoveryNode,
            raw,
            data: json,
            settings
        });
    });
}

/**
 * Discovery initialization
 * @param {Object} options
 * @returns {Discovery}
 */
export function initDiscovery(options) {
    const { Widget, router, complexViews } = require('@discoveryjs/discovery/dist/discovery.umd.js');
    const settingsPage = require('../settings').default;
    const isolateStyleMarker = require('./index.css');

    const { settings } = options;
    const { darkmode = 'auto' } = settings;
    const discovery = new Widget(options.discoveryNode, null, {
        isolateStyleMarker,
        darkmode
    });

    discovery.apply(router);
    discovery.apply(complexViews);

    settingsPage(discovery);

    discovery.page.define('default', [
        {
            view: 'struct',
            expanded: parseInt(settings.expandLevel, 10) || 0
        }
    ]);

    discovery.view.define('raw', el => {
        const { raw } = discovery.context;
        const div = document.createElement('div');

        div.classList.add('user-select');
        div.innerHTML = raw;

        el.appendChild(div);
    });

    discovery.page.define('raw', [{
        view: 'raw'
    }]);

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
        content: 'text:"Raw"',
        onClick: () => discovery.setPage('raw'),
        when: () => discovery.pageId !== 'raw'
    });
    discovery.nav.append({
        content: 'text:"Copy raw"',
        onClick: function() {
            const { raw } = discovery.context;
            const div = document.createElement('div');
            div.innerHTML = raw;
            const rawText = div.textContent;
            const el = document.createElement('textarea');
            el.value = rawText;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);

            this.textContent = 'Copied!';
            setTimeout(() => {
                this.textContent = 'Copy raw';
            }, 700);
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
