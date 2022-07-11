import { initDiscovery } from '../discovery';

initDiscovery(...window.__discoveryOptions)
    .then(() => {
        window.__discoveryPreloader.el.remove();
    })

