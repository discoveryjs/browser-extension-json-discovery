import whatsnew from './whatsnew.md';

export const setWhatsnewViewed = ({ version }) => {
    if (version && typeof chrome !== 'undefined') {
        chrome.storage.sync.set({ whatsnew: {
            [version]: true
        } });
    }
};
export const showWhatsNew = context => {
    const { version } = context;
    return !version ? false : !(
        context &&
        context.settings &&
        context.settings.whatsnew &&
        context.settings.whatsnew[version]
    );
};

export default host => {
    host.page.define('whatsnew', {
        view: 'block',
        content: [{
            view: 'page-header',
            content: 'h1:"What\'s new"'
        }, {
            view: 'markdown',
            source: whatsnew
        }]
    });
};
