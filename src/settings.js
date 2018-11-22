const settingsForm = document.getElementById('settings-form');
const expand = document.getElementById('expand');
const save = document.getElementById('save');
const status = document.getElementById('status');

/**
 * Restores settings from storage
 */
function restoreSettings() {
    chrome.storage.sync.get({
        expandLevel: 3
    }, settings => {
        expand.value = settings.expandLevel;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    restoreSettings();
});

save.addEventListener('click', () => {
    const expandLevel = expand.value;

    chrome.storage.sync.set({
        expandLevel
    }, () => {
        status.textContent = 'Options saved.';
        setTimeout(() => {
            status.textContent = '';
        }, 750);
    });
});

settingsForm.addEventListener('submit', event => event.preventDefault());
