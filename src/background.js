chrome.runtime.onMessage.addListener((message, { tab }) => {
    if (message.type === 'initDiscovery') {
        chrome.tabs.executeScript(tab.id, { file: 'discovery.js' });
    }
});
