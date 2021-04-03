import { flashMessage } from './flash-messages';

export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error(err); // eslint-disable-line no-console
    }

    flashMessage('JSON copied to clipboard', 'success');
}

export const copyToClipboardButton = {
    view: 'button',
    content: 'text:"Copy to clipboard"',
    onClick(_, { json }) {
        copyToClipboard(json);
    }
};
