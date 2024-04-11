import { initDiscovery } from '../discovery';
import styles from '../discovery/discovery.css';

const discoveryOptions = [
    {
        node: document.body,
        settings: { darkmode: 'auto' },
        version: 1,
        styles: [styles],
        progressbar: null
    }, { foo: 'bar' }
];

console.log("###", styles);

initDiscovery(...discoveryOptions) // eslint-disable-line no-underscore-dangle
    .then(() => {
        // window.__discoveryPreloader.el.remove(); // eslint-disable-line no-underscore-dangle
    });

