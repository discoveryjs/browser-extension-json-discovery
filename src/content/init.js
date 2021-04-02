import { rollbackContainerStyles } from '@discoveryjs/discovery/src/core/utils/container-styles';
import { preloader as createPreloader } from '@discoveryjs/discovery/src/preloader.js';
import { parseChunked } from '@discoveryjs/json-ext';
import { initDiscovery } from './init-discovery';

let loaded = document.readyState === 'complete';
let loadedTimer;
let pre = null;
let preCursor;
let initialPreDisplay = null;
let preloader = null;
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

        if (preloader !== null) {
            await preloader.progressbar.setState(getState(false));
        }
    }

    if (preloader !== null) {
        preloader.progressbar.setState(getState(true));
    }
});

const flushData = (settings) => {
    if (pre === null) {
        return;
    }

    while (true) {
        const isFirstChunk = preCursor === undefined;
        const chunkNode = isFirstChunk ? pre.firstChild : preCursor.nextSibling;

        if (!chunkNode) {
            break;
        }

        if (chunkNode.nodeType === Node.TEXT_NODE) {
            if (isFirstChunk) {
                if (/^\s*[{[]/.test(chunkNode.nodeValue)) {
                    // probably JSON
                    preloader = createPreloader({
                        container: document.body,
                        styles: [{ type: 'link', href: chrome.runtime.getURL('loader.css') }],
                        darkmode: settings.darkmode
                    });
                    preloader.progressbar.setState({ stage: 'request' });            
                } else {
                    // not a JSON
                    const error = new Error('Rollback');
                    error.rollback = true;
                    throw error;
                }
            }

            pushChunk(chunkNode.nodeValue);
        }

        preCursor = chunkNode;
    }
};

function rollbackPageChanges(error) {
    chunkBuffer.length = 0; // clean up buffer
    cancelAnimationFrame(loadedTimer);
    rollbackContainerStyles(document.body);

    if (preloader !== null) {
        preloader.el.remove();
        preloader = null;
    }

    // it might to take a lot of time to render large text,
    // so make it visible in next frame to allow styles rollback
    requestAnimationFrame(() => {
        if (pre !== null) {
            pre.style.display = initialPreDisplay;
            pre = null;
        }
    });

    if (!error.rollback) {
        console.error('[JsonDiscovery] Failed to parse JSON', error); // eslint-disable-line no-console
    }
}

async function checkLoaded(settings) {
    if (
        initialPreDisplay === null &&
        document.body &&
        document.body.firstElementChild &&
        document.body.firstElementChild.tagName === 'PRE'
    ) {
        pre = document.body.firstElementChild;
        initialPreDisplay = window.getComputedStyle(pre).display;
        pre.style.display = 'none';
    }

    if (!loaded) {
        flushData(settings);
        loadedTimer = requestAnimationFrame(() =>
            checkLoaded(settings).catch(rollbackPageChanges)
        );
        return;
    }

    if (pre !== null) {
        flushData(settings);
        pushChunk(null); // end of input

        const json = await data;

        preloader.progressbar.setState({ stage: 'done' });
        pre.remove();

        document.body.style.margin = 0;
        document.body.style.padding = 0;
        document.body.style.border = 'none';

        await initDiscovery({
            node: document.body,
            getRaw: (() => {
                let memo;
                return () => memo || (memo = pre.textContent);
            })(),
            settings,
            styles: [chrome.runtime.getURL('index.css')],
            progressbar: preloader.progressbar
        }, json);

        preloader.el.remove();
    }
}

window.addEventListener('DOMContentLoaded', () => loaded = true, false);
getSettings()
    .then(checkLoaded)
    .catch(rollbackPageChanges);

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
