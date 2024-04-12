import './discovery.css';
import { version } from '../../package.json';
import { App } from '@discoveryjs/discovery';
import flashMessages from './flash-messages';
import navbar from './navbar';
import * as pages from './pages';

/**
 * Discovery initialization
 * @param {Object} options
 * @param {Object} data
 * @returns {Discovery}
 */
export function initDiscovery() {
    const discovery = new App({
        styles: [{ type: 'link', href: 'sandbox.css' }],
        embed: true,
        inspector: true,
        // darkmode,
        darkmodePersistent: true
    });

    discovery.raw = 'todo: raw'; // TODO: move to context?
    discovery.version = version;
    discovery.apply(flashMessages);
    discovery.apply(navbar);
    discovery.apply(pages);

    discovery.setPrepare((_, { addQueryHelpers }) => {
        addQueryHelpers({
            weight(current, prec = 1) {
                const unit = ['bytes', 'kB', 'MB', 'GB'];

                while (current > 1000) {
                    current = current / 1000;
                    unit.shift();
                }

                return current.toFixed(prec).replace(/\.0+$/, '') + unit[0];
            }
        });
    });
}
