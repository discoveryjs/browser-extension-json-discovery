const FLASH_MESSAGE_SELECTORS = {
    success: 'discovery-flash-message-success',
    danger: 'discovery-flash-message-danger'
};

export default discovery => {
    discovery.view.define('flash-message', function(el) {
        discovery.view.render(el, Object.entries(FLASH_MESSAGE_SELECTORS).map(([type, className]) => ({
            view: `alert-${type}`,
            className,
            content: 'text:""'
        })));
    });
    discovery.flashMessage = (text, type) => {
        const el = document.querySelector('.' + FLASH_MESSAGE_SELECTORS[type]);

        if (el) {
            el.textContent = text;
            el.style.display = 'block';

            setTimeout(() => {
                el.style.display = 'none';
            }, 750);
        }
    };
};

