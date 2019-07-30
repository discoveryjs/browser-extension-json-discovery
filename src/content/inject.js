import { Widget, router, complexViews } from '@discoveryjs/discovery/dist/lib.umd.js';
import settingsPage from '../settings';
import '@discoveryjs/discovery/dist/lib.css';
import '@discoveryjs/discovery/client/common.css';
import './index.css';

/**
 * Discovery initialization
 * @param {Object} options
 * @returns {Discovery}
 */
function initDiscovery(options) {
    const { settings } = options;
    const discovery = new Widget(options.wrapper);

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

    discovery.addBadge(
        'Index',
        () => {
            discovery.setPage('default');
            history.replaceState(null, null, ' ');
        },
        (host) => host.pageId !== 'default'
    );
    discovery.addBadge(
        'Make report',
        () => discovery.setPage('report'),
        (host) => host.pageId !== 'report'
    );
    discovery.addBadge(
        'Settings',
        () => discovery.setPage('settings')
    );
    discovery.addBadge(
        'Raw',
        () => discovery.setPage('raw'),
        (host) => host.pageId !== 'raw'
    );
    discovery.addBadge(
        'Copy raw',
        function() {
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
        (host) => {
            if (host.pageId === 'raw') {
                document.body.classList.add('no-user-select');
            } else {
                document.body.classList.remove('no-user-select');
            }

            return host.pageId === 'raw';
        }
    );

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
function getSettings(cb) {
    chrome.storage.sync.get({
        expandLevel: 3
    }, settings => {
        cb(settings);
    });
}

(function() {
    let json;
    let raw;

    let { textContent } = document.body;
    textContent = textContent.trim();

    if (textContent.startsWith('{') || textContent.startsWith('[')) {
        try {
            json = JSON.parse(textContent);
        } catch (_) {}
    }

    if (json) {
        raw = document.body.innerHTML;

        document.body.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.classList.add('discovery');

        document.body.appendChild(wrapper);

        wrapper.style['background-color'] = '#fff';

        getSettings(settings => {
            initDiscovery({
                wrapper,
                raw,
                data: json,
                settings
            });
        });
    }
})();
