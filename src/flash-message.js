export default discovery => {
    discovery.view.define('flash-message', [], { tag: 'div' });
    discovery.flashMessage = (text, type) => {
        const el = document.querySelector('.view-flash-message');

        if (el) {
            discovery.view.render(el, {
                view: `alert-${type}`,
                content: `text:"${text}"`
            }).then(() => setTimeout(() => {
                el.innerHTML = '';
            }, 750));
        }
    };
};
