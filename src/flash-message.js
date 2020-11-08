export default discovery => {
    discovery.view.define('flash-message', function(el, config) {
        const { message } = config;
        const { text, type } = message;
        const view = 'alert' + (type ? `-${type}` : '');

        discovery.view.render(el, {
            view,
            content: 'text:"' + text + '"'
        });
    });
    discovery.flashMessage = (data, text, type) => {
        const message = {
            text,
            type
        };

        discovery.setData(
            discovery.data,
            Object.assign(discovery.context, data, { message })
        );

        setTimeout(() => {
            discovery.setData(
                discovery.data,
                Object.assign(discovery.context, data, { message: null })
            );
        }, 750);
    };
};

