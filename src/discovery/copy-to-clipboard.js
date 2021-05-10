import { flashMessage } from './flash-messages';

export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        // clipboard textarea fallback
        const textarea = document.createElement('textarea');
        textarea.innerText = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
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
