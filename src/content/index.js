import { Widget, router } from '../discovery/lib.umd.js';

require('../discovery/lib.css');
require('../discovery/common.css');
require('./index.css');

/**
 * Discovery initialization
 * @param {Object} settings
 * @returns {Discovery}
 */
function initDiscovery(settings) {
    const discovery = new Widget(document.body);

    discovery.apply(router);

    discovery.definePage('default', [
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

    discovery.definePage('raw', [{
        view: 'raw'
    }]);

    discovery.addBadge(
        'Index',
        () => discovery.setPage('default'),
        (host) => host.pageId !== 'default'
    );
    discovery.addBadge(
        'Make report',
        () => discovery.setPage('report'),
        (host) => host.pageId !== 'report'
    );
    discovery.addBadge(
        'Settings',
        () => parent.postMessage({ openSettings: true }, '*')
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
            const el = document.createElement('textarea');
            el.value = raw;
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

    return discovery;
}

window.addEventListener('message', function(event) {
    if (event.data && event.data.json) {
        const { data } = event;

        const discovery = initDiscovery(data.settings);

        discovery.setData(
            data.json,
            {
                name: data.title,
                raw: data.raw,
                createdAt: new Date().toISOString() // TODO fix in discovery
            }
        );

        discovery.renderPage('default');
    }

    window.location.hash = event.data.hash;
}, false);

window.addEventListener('hashchange', () => {
    parent.postMessage({
        hash: window.location.hash
    }, '*');
});
