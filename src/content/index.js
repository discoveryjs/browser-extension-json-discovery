import { Widget, router, complexViews } from '@discoveryjs/discovery/dist/lib.umd.js';

require('@discoveryjs/discovery/dist/lib.css');
require('@discoveryjs/discovery/client/common.css');
require('./index.css');

/**
 * Discovery initialization
 * @param {Object} settings
 * @returns {Discovery}
 */
function initDiscovery(settings) {
    const discovery = new Widget(document.body);

    discovery.apply(router);
    discovery.apply(complexViews);

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

    // TODO fix this
    let replace = null;
    const originalSetPageParams = discovery.setPageParams.bind(discovery);

    discovery.setPageParams = (...args) => {
        originalSetPageParams(...args);
        replace = args[1];
    };

    const originalRenderPage = discovery.renderPage.bind(discovery);

    discovery.renderPage = (...args) => {
        originalRenderPage(...args);

        parent.postMessage({
            hash: window.location.hash,
            replace
        }, '*');
    };

    return discovery;
}

window.addEventListener('message', function(event) {
    if (window.location.hash !== event.data.hash) {
        window.location.hash = event.data.hash;
    }

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
    }
}, false);

// window.addEventListener('hashchange', () => {
//     parent.postMessage({
//         hash: window.location.hash
//     }, '*');
// });
