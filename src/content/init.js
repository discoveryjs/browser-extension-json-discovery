import { preloader as createPreloader } from '@discoveryjs/discovery/dist/discovery-preloader.js';
import { parseChunked } from '@discoveryjs/json-ext';
import { initDiscovery } from './init-discovery';

let loaded = document.readyState === 'complete';
let loadedTimer;
let pre = null;
let preCursor;
let initialPreDisplay = null;
let preloader;
let pushChunk = () => {};
const chunkBuffer = [];
const getChunk = () => {
    if (chunkBuffer.length) {
        return chunkBuffer.shift();
    }

    return new Promise(resolve => {
        pushChunk = chunk => {
            resolve(chunk);
            pushChunk = chunk => chunkBuffer.push(chunk);
        };
    });
};
const data = parseChunked(async function*() {
    const loadStartTime = Date.now();
    let size = 0;
    const getState = done => ({
        stage: 'receive',
        progress: {
            done,
            elapsed: Date.now() - loadStartTime,
            units: 'bytes',
            completed: size
        }
    });

    while (true) {
        const chunk = await getChunk();

        if (!chunk) {
            break;
        }

        yield chunk;
        size += chunk.length;

        if (preloader) {
            await preloader.progressbar.setState(getState(false));
        }
    }

    preloader.progressbar.setState(getState(true));
});

data.catch(error => {
    cancelAnimationFrame(loadedTimer);
    preloader.el.remove();
    document.body.style.cssText = '';

    if (pre !== null) {
        requestAnimationFrame(() => {
            // it might to take a lot of time to render large text,
            // so make it visible in next frame to allow styles rollback
            pre.style.display = initialPreDisplay;
            pre = null;
        });
    }

    console.error('[JsonDiscovery] Failed to parse JSON', error); // eslint-disable-line no-console
});

const flushData = () => {
    if (pre === null) {
        return;
    }

    while (true) {
        const chunkNode = preCursor === undefined ? pre.firstChild : preCursor.nextSibling;

        if (!chunkNode) {
            break;
        }

        if (chunkNode.nodeType === Node.TEXT_NODE) {
            pushChunk(chunkNode.nodeValue);
        }

        preCursor = chunkNode;
    }
};

loadedTimer = requestAnimationFrame(async function checkLoaded() {
    if (
        initialPreDisplay === null &&
        document.body &&
        document.body.firstElementChild &&
        document.body.firstElementChild.tagName === 'PRE'
    ) {
        pre = document.body.firstElementChild;
        initialPreDisplay = window.getComputedStyle(pre).display;
        pre.style.display = 'none';

        const settings = await getSettings();
        preloader = createPreloader({
            container: document.body,
            styles: [{ type: 'link', href: chrome.runtime.getURL('loader.css') }],
            darkmode: settings.darkmode
        });
        preloader.progressbar.setState({ stage: 'request' });
    }

    if (!loaded) {
        flushData();
        loadedTimer = requestAnimationFrame(checkLoaded);
        return;
    }

    if (pre !== null) {
        let json;

        flushData();
        pushChunk(null);

        try {
            json = await data;
            preloader.progressbar.setState({ stage: 'done' });
        } catch (e) {
            return;
        }

        // document.body.innerHTML = '';
        pre.remove();

        document.body.style.margin = 0;
        document.body.style.padding = 0;
        document.body.style.border = 'none';

        const settings = await getSettings();

        await initDiscovery({
            node: document.body,
            raw: pre.textContent, // FIXME: should be computed lazyly
            settings,
            styles: [chrome.runtime.getURL('index.css')],
            progressbar: preloader.progressbar
        }, json);

        preloader.el.remove();
    }
});

window.addEventListener('DOMContentLoaded', () => loaded = true, false);

/**
 * Restores settings from storage
 * @returns {Promise}
 */
function getSettings() {
    return new Promise(resolve => {
        chrome.storage.sync.get({
            expandLevel: 3,
            darkmode: 'auto'
        }, settings => {
            resolve(settings);
        });
    });
}
