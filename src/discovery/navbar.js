import copyText from '@discoveryjs/discovery/lib/core/utils/copy-text.js';
import { showWhatsNew, setWhatsnewViewed } from './pages/whatsnew';

export default host => {
    host.nav.append({
        when: () => showWhatsNew(host.version) && host.pageId !== 'whatsnew',
        content: 'text:"What\'s new"',
        onClick: () => {
            host.setPage('whatsnew');
            setWhatsnewViewed(host.context);
        }
    });
    host.nav.append({
        content: 'text:"Copy URL"',
        async onClick() {
            copyText(await host.action.call('permalink'));
            host.action.call('flashMessage', 'URL copied to clipboard', 'success');
        }
    });
    host.nav.append({
        when: () => host.pageId !== 'default',
        content: 'text:"Default view"',
        onClick() {
            host.setPage('default');
            history.replaceState(null, null, ' '); // ????
        }
    });
    host.nav.append({
        when: () => host.pageId !== 'raw',
        content: 'text:"JSON"',
        onClick: () => host.setPage('raw'),
        postRender(el) {
            el.title = 'Show JSON as is';
        }
    });
    host.nav.menu.append({
        content: 'text:"Download JSON as file"',
        onClick(_, { hide }) {
            hide();
            host.action.call('downloadAsFile');
        }
    });
    host.nav.menu.append({
        content: 'text:"Copy JSON to clipboard"',
        async onClick(_, { hide }) {
            hide();
            await host.action.call('copyToClipboard');
            host.action.call('flashMessage', 'JSON copied to clipboard', 'success');
        }
    });
    host.nav.menu.append({
        content: 'text:"Settings"',
        onClick(_, { hide }) {
            hide();
            host.setPage('settings');
        }
    });
    host.nav.menu.append({
        content: 'text:"What\'s new"',
        onClick(_, { hide }) {
            hide();
            host.setPage('whatsnew');
            setWhatsnewViewed(host.context);
        }
    });
};
