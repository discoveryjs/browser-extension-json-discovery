import { flashMessage } from './flash-messages';
import copyText from '@discoveryjs/discovery/src/core/utils/copy-text';

export const copyToClipboardButton = {
    view: 'button',
    content: 'text:"Copy to clipboard"',
    onClick(_, { json }) {
        copyText(json).then(() => {
            flashMessage('JSON copied to clipboard', 'success');
        });
    }
};
