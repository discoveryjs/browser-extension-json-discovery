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

let json;
let raw;

try {
    json = JSON.parse(document.body.innerText);
} catch (_) {}

if (json) {
    const iframe = document.createElement('iframe');
    const content = chrome.extension.getURL('pages/content.html');

    iframe.src = content;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = 0;

    raw = document.body.innerHTML;
    document.body.innerHTML = '';

    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.userSelect = 'none';

    const wrapper = document.createElement('div');

    wrapper.style.position = 'absolute';
    wrapper.style.top = 0;
    wrapper.style.bottom = 0;
    wrapper.style.left = 0;
    wrapper.style.right = 0;

    document.body.appendChild(wrapper);
    wrapper.appendChild(iframe);

    iframe.addEventListener('load', () => {
        getSettings(settings => {
            iframe.contentWindow.postMessage({
                json,
                raw,
                hash: window.location.hash,
                title: document.location.href.replace(document.location.hash, ''),
                settings
            }, '*');
        });
    });

    const setHash = debounce(hash => {
        if (hash) {
            window.location.hash = hash;
        } else if (window.location.hash) {
            history.pushState('', document.title, window.location.pathname + window.location.search);
        }
    }, 300);

    const onMessage = event => {
        setHash(event.data.hash);

        if (event.data && event.data.openSettings) {
            if (chrome.runtime.openOptionsPage) {
                chrome.runtime.openOptionsPage();
            } else {
                window.open(chrome.runtime.getURL('pages/settings.html'));
            }
        }
    };

    window.addEventListener('message', onMessage);

    const onHashChange = () => {
        iframe.contentWindow.postMessage({
            hash: window.location.hash
        }, '*');
    };

    window.addEventListener('hashchange', onHashChange);

    window.addEventListener('beforeunload', () => {
        window.removeEventListener('message', onMessage);
        window.removeEventListener('hashchange', onHashChange);
    });
}

/**
 * Debounce
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
function debounce(func, wait) {
    let timer = null;

    return function(...args) {
        const onComplete = () => {
            func.apply(this, args);
            timer = null;
        };

        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(onComplete, wait);
    };
}
