export const init = initDiscoveryBundled => {
    let loaded = document.readyState === 'complete';
    let pre = null;
    let initialPreDisplay = null;
    let af;

    af = requestAnimationFrame(async function x() {
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
            cancelAnimationFrame(af);
            af = requestAnimationFrame(x);
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

            // Firefox bundled version
            if (typeof initDiscoveryBundled === 'function') {
                getSettings(settings => {
                    initDiscoveryBundled({
                        node: document.body,
                        raw: textContent,
                        data: json,
                        settings,
                        styles: [chrome.runtime.getURL('index.css')]
                    });
                });
            }

            try {
                const { initDiscovery } = await import(chrome.runtime.getURL('init-discovery.js'));

                getSettings(settings => {
                    initDiscovery({
                        node: document.body,
                        raw: textContent,
                        data: json,
                        settings,
                        styles: [chrome.runtime.getURL('index.css')]
                    });
                });
            } catch (_) {}
        }
    });

    window.addEventListener('DOMContentLoaded', () => loaded = true, false);
};

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
