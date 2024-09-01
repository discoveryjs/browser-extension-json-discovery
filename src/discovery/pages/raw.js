import { copyToClipboardButton } from '../copy-to-clipboard';
import { downloadAsFileButton } from '../download-as-file';

export default host => {
    host.view.define('raw', async el => {
        const contentEl = el.appendChild(document.createElement('pre'));

        contentEl.className = 'content';

        const raw = await host.query('"getRaw".callAction()');
        if (raw.firstSlice) {
            contentEl.append(raw.firstSlice);
            host.view.render(el, {
                view: 'alert-warning',
                className: 'too-big-json',
                content: [
                    'text:`JSON is too big (${size.weight()} bytes), only first ${firstSlice.size().weight()} is shown. Output the entire JSON may cause to browser\'s tab freezing for a while. `',
                    {
                        view: 'button',
                        content: 'text:"Show all"',
                        onClick(el) {
                            const alertEl = el.parentNode;
                            alertEl.textContent = 'Output entire JSON...';
                            setTimeout(() => {
                                contentEl.append(raw.json.slice(raw.firstSlice.length));
                                alertEl.remove();
                            }, 50);
                        }
                    }
                ]
            }, raw);
        } else {
            contentEl.append(raw.json);
        }
    });

    host.page.define('raw', {
        view: 'context',
        data: () => host.raw,
        content: [
            {
                view: 'page-header',
                content: [
                    copyToClipboardButton,
                    downloadAsFileButton
                ]
            },
            'raw'
        ]
    });
};
