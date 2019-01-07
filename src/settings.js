const settingsForm = document.getElementById('settings-form');
const expand = document.getElementById('expand');
const addHost = document.getElementById('add-host');
const presetsNode = document.getElementById('presets');
const save = document.getElementById('save');
const status = document.getElementById('status');

const errors = new Set();

const examplePresets = [
    {
        host: '*',
        presets: [{ name: 'table', content: '"table"' }]
    }
];

/**
 * Creates preset node
 * @param {Object} preset
 * @param {HTMLElement} parentNode
 */
function createPresetNode(preset, parentNode) {
    const { name, content } = preset;
    const presetNode = document.createElement('li');
    const presetInput = document.createElement('input');
    const presetTextarea = document.createElement('textarea');
    const removePreset = document.createElement('button');

    presetNode.classList.add('preset-item');

    presetInput.value = name;
    presetInput.classList.add('preset-name');
    presetTextarea.textContent = content;
    presetTextarea.classList.add('preset-content');
    removePreset.innerHTML = 'Remove preset';

    removePreset.addEventListener('click', () => {
        parentNode.removeChild(presetNode);
    });

    presetNode.appendChild(presetInput);
    presetNode.appendChild(presetTextarea);
    presetNode.appendChild(removePreset);

    parentNode.appendChild(presetNode);
}

/**
 * Creates host preset node
 * @param {Object} hostPreset
 */
function createHostPresetNode(hostPreset) {
    const { host, presets = [] } = hostPreset;
    const presetNode = document.createElement('li');
    const removeHost = document.createElement('button');
    const hostInput = document.createElement('input');
    const presetsList = document.createElement('ul');

    presetNode.classList.add('preset');

    hostInput.type = 'text';
    hostInput.value = host;
    hostInput.classList.add('preset-host');
    removeHost.innerHTML = 'Remove host';

    removeHost.addEventListener('click', () => {
        presetsNode.removeChild(presetNode);
    });

    presets.forEach(el => createPresetNode(el, presetsList));

    presetNode.appendChild(hostInput);
    presetNode.appendChild(removeHost);
    presetNode.appendChild(presetsList);
    presetsNode.appendChild(presetNode);

    const addPreset = document.createElement('button');

    addPreset.innerHTML = 'Add Preset';

    addPreset.addEventListener('click', () => {
        createPresetNode({ name: '', content: '""' }, presetsList);
    });

    presetNode.appendChild(addPreset);
}

/**
 * Restores settings from storage
 */
function restoreSettings() {
    chrome.storage.sync.get({
        expandLevel: 3,
        viewPresets: examplePresets
    }, settings => {
        expand.value = settings.expandLevel;
        settings.viewPresets.forEach(createHostPresetNode);
    });
}

/**
 * Gets view presets from DOM
 * @returns {Object}
 */
function getViewPresets() {
    const presetsResult = [];
    const presetElements = presetsNode.querySelectorAll('.preset');

    presetElements.forEach(el => {
        const presetHost = { presets: [] };
        const host = el.querySelector('.preset-host');

        if (!host.value) {
            errors.add('Host is required!');
            host.classList.add('error');
        } else {
            host.classList.remove('error');
        }

        presetHost.host = host.value;

        const presetItems = el.querySelectorAll('.preset-item');

        presetItems.forEach(item => {
            const presetName = item.querySelector('.preset-name');

            if (!presetName.value) {
                errors.add('Name is required!');
                presetName.classList.add('error');
            } else {
                presetName.classList.remove('error');
            }

            const presetContent = item.querySelector('.preset-content');

            if (!presetContent.value) {
                errors.add('Content is required!');
                presetContent.classList.add('error');
            } else {
                presetContent.classList.remove('error');
            }

            try {
                JSON.parse(presetContent.value);
            } catch (_) {
                errors.add('Content must be a valid JSON!');
                presetContent.classList.add('error');
            }

            presetHost.presets.push({
                name: presetName.value,
                content: presetContent.value
            });
        });

        presetsResult.push(presetHost);
    });

    if (errors.size) {
        return null;
    }

    return presetsResult;
}

document.addEventListener('DOMContentLoaded', () => {
    restoreSettings();
});

addHost.addEventListener('click', () => {
    createHostPresetNode({
        host: '',
        presets: []
    });
});

save.addEventListener('click', () => {
    errors.clear();

    const expandLevel = expand.value;

    if (!expandLevel) {
        expand.classList.add('error');
        errors.add('Expand level is required!');
    } else {
        expand.classList.remove('error');
    }

    const viewPresets = getViewPresets();

    if (!expandLevel || !viewPresets) {
        status.classList.add('error');
        status.textContent = [...errors].join(' ');
    } else {
        status.classList.remove('error');
        chrome.storage.sync.set({
            expandLevel,
            viewPresets
        }, () => {
            status.textContent = 'Options saved.';
            status.classList.remove('error');
            setTimeout(() => {
                status.textContent = '';
            }, 750);
        });
    }
});

settingsForm.addEventListener('submit', event => event.preventDefault());
