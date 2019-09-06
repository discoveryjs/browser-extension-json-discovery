import { init } from './init';

document.addEventListener('DOMContentLoaded', () => {
    safari.extension.dispatchMessage('getSettings', {});

    safari.self.addEventListener('message', (event) => {
        if (event.name === 'settings') {
            const settings = event.message;

            init((cb) => cb(settings));
        }
    });
});
