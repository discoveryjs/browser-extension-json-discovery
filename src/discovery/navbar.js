import { navButtons } from '@discoveryjs/discovery';
import copyText from '@discoveryjs/discovery/src/core/utils/copy-text';
import { downloadAsFile } from './download-as-file';
import { flashMessage } from './flash-messages';
import { showWhatsNew, setWhatsnewViewed } from './pages/whatsnew';

export default host => {
    host.nav.append({
        when: () => showWhatsNew(host.context) && host.pageId !== 'whatsnew',
        content: 'text:"What\'s new"',
        onClick: () => {
            host.setPage('whatsnew');
            setWhatsnewViewed(host.context);
        }
    });
    host.nav.append({
        when: () => host.pageId !== 'default',
        content: 'text:"Default view"',
        onClick: () => {
            host.setPage('default');
            history.replaceState(null, null, ' ');
        }
    });
    host.nav.append({
        when: () => host.pageId !== 'report',
        content: 'text:"Make report"',
        onClick: () => host.setPage('report')
    });
    host.nav.append({
        when: () => host.pageId !== 'raw',
        content: 'text:"JSON"',
        onClick: () => host.setPage('raw'),
        postRender(el) {
            el.title = 'Show JSON as is';
        }
    });
    host.apply(navButtons.inspect);
    host.nav.menu.append({
        content: 'text:"Download JSON as file"',
        onClick: (_, { hide }) => hide() & downloadAsFile(host.raw.json)
    });
    host.nav.menu.append({
        content: 'text:"Copy JSON to clipboard"',
        onClick: (_, { hide }) => hide() &
            copyText(host.raw.json) &
            flashMessage('JSON copied to clipboard', 'success')
    });
    host.nav.menu.append({
        content: 'text:"Settings"',
        onClick: (_, { hide }) => hide() & host.setPage('settings')
    });
    host.nav.menu.append({
        content: 'text:"What\'s new"',
        onClick: (_, { hide }) => hide() & host.setPage('whatsnew') & setWhatsnewViewed(host.context)
    });
};
