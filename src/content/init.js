let loaded = document.readyState === 'complete';
let pre = null;
let initialPreDisplay = null;

requestAnimationFrame(async function x() {
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

        const shadow = document.body.attachShadow({ mode: 'open' });

        const styles = document.createElement('link');
        styles.rel = 'stylesheet';
        styles.href = chrome.runtime.getURL('index.css');

        const discoveryNode = document.createElement('div');
        discoveryNode.style.height = '100%';

        shadow.appendChild(styles);
        shadow.appendChild(discoveryNode);

        try {
            const { initDiscovery } = await import(chrome.runtime.getURL('inject.js'));

            getSettings(settings => {
                initDiscovery({
                    discoveryNode,
                    raw: textContent,
                    data: json,
                    settings
                });
            });
        } catch (_) {}
    }
});

window.addEventListener('DOMContentLoaded', () => loaded = true, false);

/**
 * Restores settings from storage
 * @param {Function} cb
 */
function getSettings(cb) {
    chrome.storage.sync.get({
        expandLevel: 3,
        darkmode: 'auto'
    }, settings => {
        cb(settings);
    });
}
