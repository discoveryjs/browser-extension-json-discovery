import { initDiscovery } from '../discovery';

initDiscovery(...window.__discoveryOptions) // eslint-disable-line no-underscore-dangle
    .then(() => {
        window.__discoveryPreloader.el.remove(); // eslint-disable-line no-underscore-dangle
    });

