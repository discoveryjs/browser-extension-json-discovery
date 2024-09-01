import { applyContainerStyles, rollbackContainerStyles } from '@discoveryjs/discovery/src/core/utils/container-styles';
import { connectToEmbedApp } from '@discoveryjs/discovery/dist/discovery-embed-host.js';
import { downloadAsFile } from '../discovery/download-as-file';

let loaded = document.readyState === 'complete';
let loadedTimer;
let disabledElements = [];
let pre = null;
let iframe = null;
let preCursor;
let prevCursorValue = '';
let dataStreamController = null;
let stylesApplied = false;
let totalSize = 0;
let firstSlice = '';
const firstSliceMaxSize = 100 * 1000;

let iframeWorks = false;

window.addEventListener('message', e => {
    if (e.data === 'loaded') {
        iframeWorks = true;
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
        const chunkNode = isFirstChunk
            ? pre.firstChild
            // In some cases a browser appends new content to an existing text node
            // instead of creating new one. In this case, we are using the same text node
            // as on previous iteration and slice appended content as a chunk content.
            : preCursor.nodeValue !== prevCursorValue
                ? preCursor
                : preCursor.nextSibling;

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
                    if (dataStreamController === null) {
                        if (iframe === null) {
                            console.log('append iframe');
                            document.body.append(getIframe(settings));
                        }
                        return;
                    }
                } else {
                    // bailout: not a JSON or a non-object / non-array value
                    throw raiseBailout();
                }
            }

            const chunk = chunkNode === preCursor
                // slice a new content from a chunk node in case a content
                // was appended to an existing text node
                ? chunkNode.nodeValue.slice(prevCursorValue.length)
                : chunkNode.nodeValue;

            totalSize += chunk.length;

            if (firstSlice.length < firstSliceMaxSize) {
                const left = firstSliceMaxSize - firstSlice.length;
                firstSlice += left > chunk.length ? chunk : chunk.slice(0, left);
            }

            dataStreamController.enqueue(chunk);
        } else {
            // bailout: not a text node -> a complex markup is not a JSON
            throw raiseBailout();
        }

        preCursor = chunkNode;
        prevCursorValue = preCursor.nodeValue;
    }
};

function rollbackPageChanges(error) {
    cancelAnimationFrame(loadedTimer);
    rollbackContainerStyles(document.body);

    dataStreamController?.close();
    dataStreamController = null;

    if (iframe !== null) {
        iframe.remove();
        iframe = null;
    }

    // it might to take a lot of time to render large text,
    // so make it visible in next frame to allow styles rollback
    requestAnimationFrame(() => {
        if (disabledElements !== null) {
            disabledElements.forEach(({ element, hidden, remove }) =>
                remove ? element.remove() : (element.hidden = hidden)
            );
            disabledElements = null;
        }
    });

    if (!error.rollback) {
        console.error('[JsonDiscovery] Failed to parse JSON', error); // eslint-disable-line no-console
    }
}

function isPre(element) {
    // This branch is used to override Edge's default JSON viewer
    if (element?.hasAttribute('hidden') && document.body?.dataset?.codeMirror) {
        // Creating a <style> element to hide all the elements in the body;
        // The [hidden] attribute is not effective for CodeMirror because "display: flex"
        // is assigned with !important. Utilizing a layer ensures that all previous rules are overridden.
        const styleEl = document.createElement('style');
        styleEl.append('@layer super-top-layer{body>:not(.discovery){display:none!important}}');

        // Inserting a <div> element as the first child of the body prevents JSON
        // parsing by Edge's default JSON viewer, especially for large JSON files (above 1MB).
        // Since we're replacing the functionality of the default viewer,
        // this approach is efficient in terms of performance and resource utilization.
        const fakeJsonEl = document.createElement('div');
        fakeJsonEl.hidden = true;
        fakeJsonEl.append('{}');

        // Add to DOM
        disableElement(fakeJsonEl, true);
        disableElement(styleEl, true);
        element.before(fakeJsonEl, styleEl);

        return element;
    }

    return element?.tagName === 'PRE' ? element : null;
}

function disableElement(element, remove = false) {
    disabledElements.push({
        element,
        hidden: element.hidden,
        remove
    });
    element.hidden = true;
}

function getIframe(settings) {
    if (iframe !== null) {
        return iframe;
    }

    iframe = document.createElement('iframe');
    iframe.className = 'discovery';
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.src = chrome.runtime.getURL('sandbox.html');
    iframe.style.cssText = 'position: fixed; inset: 0; border: 0; width: 100%; height: 100%; opacity: 0.001';

    connectToEmbedApp(iframe, (app) => {
        // sync location
        app.setRouterPreventLocationUpdate(true);
        app.setPageHash(location.hash);
        window.addEventListener('hashchange', () => app.setPageHash(location.hash), false);
        app.on('pageHashChanged', (newPageHash, replace) => {
            if (replace) {
                location.replace(newPageHash);
            } else {
                location.hash = newPageHash;
            }
        });

        // settings
        let darkmode = 'auto';

        switch (settings.darkmode) {
            case true:
                darkmode = 'dark';
                break;
            case false:
                darkmode = 'light';
                break;
        }

        app.setDarkmode(darkmode);
        app.defineAction('getSettings', () => settings);
        app.defineAction('setSettings', settings => {
            chrome.storage.sync.set(settings);
        });

        app.defineAction('downloadAsFile', _ => {
            downloadAsFile(pre.textContent);
        });

        app.defineAction('permalink', () => window.location.toString());

        app.defineAction('getRaw', () => ({
            firstSlice: totalSize < firstSliceMaxSize * 2 ? null : firstSlice,
            size: totalSize,
            json: totalSize <= firstSliceMaxSize ? firstSlice : pre.textContent
        }));

        app.on('darkmodeChanged', async event => {
            const settings = await getSettings();
            let darkmode = 'auto';

            switch (event.value) {
                case 'light':
                    darkmode = false;
                    break;
                case 'dark':
                    darkmode = true;
                    break;
            }

            chrome.storage.sync.set({ ...settings, darkmode });
        });

        // upload data
        app.uploadData(new ReadableStream({
            start(controller_) {
                dataStreamController = controller_;
            },
            cancel() {
                dataStreamController = null;
            }
        }));

        // check load and appearance
        getSettings().then(checkLoaded);
        setTimeout(() => iframe.style.opacity = '1', 100);
    });

    return iframe;
}

async function checkLoaded(settings) {
    console.log('checkLoaded');
    if (pre === null) {
        const firstElement = document.body?.firstElementChild;

        pre = isPre(firstElement) || isPre(firstElement?.nextElementSibling);

        if (pre) {
            console.log('detected pre');
            disableElement(pre);

            // Chrome placed formatter container before <pre> in mid 2023
            // https://issues.chromium.org/issues/40282442
            if (firstElement !== pre) {
                disableElement(firstElement);
            }

            // Chrome moved formatter container after <pre>
            // https://github.com/chromium/chromium/commit/1ca95a7aedd55cafb40f11e839a02bf8cc7ef99d
            if (pre.nextElementSibling?.classList?.contains('json-formatter-container')) {
                disableElement(pre.nextElementSibling);
            }
        }
    }

    if (!settings) {
        console.log('no settings');
        return;
    } else if (pre === null) {
        return;
    }

    if (!stylesApplied) {
        console.log('apply styles');
        stylesApplied = true;
        applyContainerStyles(document.body, settings);
    }

    if (!loaded) {
        console.log('no loaded:', loaded);
        flushData(settings);
        loadedTimer = requestAnimationFrame(() =>
            checkLoaded(settings)
                .catch(rollbackPageChanges)
                .finally(() => {
                    if (!iframeWorks) {
                        rollbackPageChanges(raiseBailout());
                        return;
                    }
                })
        );
        return;
    }

    if (pre !== null) {
        flushData(settings);

        dataStreamController?.close();
        dataStreamController = null;
    }
}

window.addEventListener('DOMContentLoaded', () => loaded = true, false);
checkLoaded();
getSettings()
    .then(checkLoaded)
    .catch(rollbackPageChanges);

/**
 * Restores settings from storage
 * @returns {Promise}
 */
function getSettings() {
    return chrome.storage.sync.get({
        expandLevel: 3,
        darkmode: 'auto',
        whatsnew: {}
    });
}
