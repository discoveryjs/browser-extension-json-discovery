import { copyToClipboardButton } from '../copy-to-clipboard';
import { downloadAsFileButton } from '../download-as-file';

export default host => {
    host.page.define('default', {
        view: 'context',
        modifiers: {
            view: 'page-header',
            content: [
                copyToClipboardButton,
                downloadAsFileButton,
                {
                    view: 'block',
                    content: [
                        {
                            view: 'button',
                            className: 'collapse-all',
                            content: 'text:"-"',
                            onClick(el, data, { onChange }) {
                                onChange(1, 'expandLevel');
                            },
                            postRender(el, config, data, context) {
                                context.onChange = config.onChange;
                                el.title = 'Collapse all';
                                el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">' +
                                    '<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793z"/>' +
                                    '</svg>';
                            }
                        },
                        {
                            view: 'button',
                            className: 'expand-all',
                            content: 'text:"+"',
                            onClick(el, data, { onChange }) {
                                onChange(100, 'expandLevel');
                            },
                            postRender(el, config, data, context) {
                                context.onChange = config.onChange;
                                el.title = 'Expand all';
                                el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">' +
                                    '<path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8zM7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10z"/>' +
                                    '</svg>';
                            }
                        }
                    ]
                }
            ]
        },
        content: {
            view: 'struct',
            expanded: '=+(#.expandLevel or #.settings.expandLevel)'
        }
    });
};
