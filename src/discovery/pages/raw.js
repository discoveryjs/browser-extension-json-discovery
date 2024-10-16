import { copyToClipboardButton } from '../copy-to-clipboard';
import { downloadAsFileButton } from '../download-as-file';

export default host => {
    host.view.define('raw', async function(el) {
        const contentEl = el.appendChild(document.createElement('pre'));

        contentEl.className = 'content';

        const {
            firstSliceText,
            firstSliceSize,
            fullSize
        } = await host.action.call('getRaw');

        contentEl.append(firstSliceText);

        if (firstSliceSize < fullSize) {
            this.render(el, {
                view: 'alert-warning',
                className: 'too-big-json',
                content: [
                    'text:`JSON is too big (${fullSize.weight()} bytes), only first ${firstSliceSize.weight()} is shown. Output the entire JSON may cause to browser\'s tab freezing for a while. `',
                    {
                        view: 'button',
                        content: 'text:"Show all"',
                        onClick(el) {
                            const alertEl = el.parentNode;

                            alertEl.textContent = 'Output entire JSON...';

                            setTimeout(async() => {
                                const { json } = await host.action.call('getRawFull');

                                contentEl.textContent = json;
                                alertEl.remove();
                            }, 50);
                        }
                    }
                ]
            }, {
                firstSliceSize,
                fullSize
            });
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
