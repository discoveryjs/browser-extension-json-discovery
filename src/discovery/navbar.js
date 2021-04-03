import { navButtons } from '@discoveryjs/discovery';
import { copyToClipboard } from '../copy-to-clipboard';
import { downloadAsFile } from '../download-as-file';

export default function(host) {
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
        onClick: (_, { hide }) => hide() & copyToClipboard(host.raw.json)
    });
    host.nav.menu.append({
        content: 'text:"Settings"',
        onClick: (_, { hide }) => hide() & host.setPage('settings')
    });
}
