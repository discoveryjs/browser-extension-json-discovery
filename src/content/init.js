import { rollbackContainerStyles } from '@discoveryjs/discovery/src/core/utils/container-styles';
import { preloader as createPreloader } from '@discoveryjs/discovery/src/preloader.js';
import parseChunked from '@discoveryjs/json-ext/src/parse-chunked';

let loaded = document.readyState === 'complete';
let loadedTimer;
let pre = null;
let preCursor;
let initialPreDisplay = null;
let preloader = null;
let pushChunk = () => {};
let totalSize = 0;
let firstSlice = '';
const firstSliceMaxSize = 100 * 1000;
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
    const getState = done => ({
        stage: 'receive',
        progress: {
            done,
            elapsed: Date.now() - loadStartTime,
            units: 'bytes',
            completed: totalSize
        }
    });

    while (true) {
        const chunk = await getChunk();

        if (!chunk) {
            break;
        }

        yield chunk;
        totalSize += chunk.length;

        if (firstSlice.length < firstSliceMaxSize) {
            const left = firstSliceMaxSize - firstSlice.length;
            firstSlice += left > chunk.length ? chunk : chunk.slice(0, left);
        }

        if (preloader !== null) {
            await preloader.progressbar.setState(getState(false));
        }
    }

    if (preloader !== null) {
        preloader.progressbar.setState(getState(true));
    }
});

function raiseBailout() {
    return Object.assign(new Error('Rollback'), { rollback: true });
}

const flushData = (settings) => {
    if (pre === null) {
        return;
    }

    while (true) {
        const isFirstChunk = preCursor === undefined;
        const chunkNode = isFirstChunk ? pre.firstChild : preCursor.nextSibling;

        if (!chunkNode) {
            if (isFirstChunk && (loaded || pre.nextSibling)) {
                // bailout: first <pre> is empty
                throw raiseBailout();
            }

            break;
        }

        if (chunkNode.nodeType === Node.TEXT_NODE) {
            if (isFirstChunk) {
                if (/^\s*[{[]/.test(chunkNode.nodeValue)) {
                    // probably JSON, accept an object or an array only to reduce false positive
                    preloader = createPreloader({
                        container: document.body,
                        styles: [{ type: 'link', href: chrome.runtime.getURL('preloader.css') }],
                        darkmode: settings.darkmode
                    });
                    preloader.progressbar.setState({ stage: 'request' });
                } else {
                    // bailout: not a JSON or a non-object / non-array value
                    throw raiseBailout();
                }
            }

            pushChunk(chunkNode.nodeValue);
        } else {
            // bailout: not a text node -> a complex markup is not a JSON
            throw raiseBailout();
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
        pre === null &&
        document.body &&
        document.body.firstElementChild &&
        document.body.firstElementChild.tagName === 'PRE'
    ) {
        pre = document.body.firstElementChild;
        initialPreDisplay = pre.style.display;
        pre.style.display = 'none';
    }

    if (pre !== null) {
        if (!loaded) {
            flushData(settings);
            loadedTimer = requestAnimationFrame(() =>
                checkLoaded(settings).catch(rollbackPageChanges)
            );
            return;
        }

        flushData(settings);
        pushChunk(null); // end of input

        const json = await data;

        window.__discoveryPreloader = preloader; // eslint-disable-line no-underscore-dangle

        window.__discoveryOptions = [ // eslint-disable-line no-underscore-dangle
            {
                node: document.body,
                raw: Object.defineProperties({}, {
                    firstSlice: {
                        value: totalSize < firstSliceMaxSize * 2 ? null : firstSlice
                    },
                    size: {
                        value: totalSize
                    },
                    json: totalSize <= firstSliceMaxSize ? { value: firstSlice } : {
                        configurable: true,
                        get() {
                            return Object.defineProperty(this, 'json', {
                                value: pre.textContent
                            }).json;
                        }
                    }
                }),
                settings,
                styles: [chrome.runtime.getURL('index.css')],
                progressbar: window.__discoveryPreloader.progressbar // eslint-disable-line no-underscore-dangle
            }, json
        ];

        const initDiscovery = await import(chrome.runtime.getURL('discovery.js'));

        if (typeof initDiscovery !== 'function') {
            await chrome.runtime.sendMessage({ type: 'initDiscovery' });
        }
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
