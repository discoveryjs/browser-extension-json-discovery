export const copyToClipboardButton = {
    view: 'button',
    content: 'text:"Copy to clipboard"',
    async onClick(_, __, host) {
        await host.actions.copyToClipboard();
        host.actions.flashMessage('JSON copied to clipboard', 'success');
    }
};
