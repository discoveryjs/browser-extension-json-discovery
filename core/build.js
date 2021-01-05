const fs = require('fs');
const path = require('path');
const bundleJs = require('esbuild').build;
const manifest = require('../src/manifest.js');

const { NODE_ENV } = process.env;
const watch = NODE_ENV !== 'production';

const indir = path.join(__dirname, '/../src');

const browsers = [
    'chrome',
    'firefox',
    'safari'
];

function copyFiles(src, dest) {
    fs.mkdirSync(dest, { recursive: true });

    if (fs.statSync(src).isDirectory()) {
        fs.readdirSync(src).forEach(p =>
            copyFiles(path.join(src, p), path.join(dest, path.basename(src)))
        );
    } else {
        fs.copyFileSync(src, path.join(dest, path.basename(src)));
    }
}

async function build(browser) {
    const outdir = path.join(__dirname, `/../build-${browser}`);

    fs.rmdirSync(outdir, { recursive: true });
    fs.mkdirSync(outdir, { recursive: true });
    fs.writeFileSync(outdir + '/manifest.json', manifest(browser));

    if (browser !== 'safari') {
        copyFiles(path.join(indir, 'icons'), outdir);
    }

    bundleJs({
        entryPoints: [
            path.join(indir, 'content/index.css'),
            path.join(indir, browser === 'safari' ? 'content/inject-safari.js' : 'content/inject.js')
        ],
        bundle: true,
        minify: true,
        outdir,
        define: {
            ISOLATE_STYLE_MARKER: null
        }
    }).catch(() => process.exit(1));
}

const buildAll = async function() {
    console.log('Building bundles...'); // eslint-disable-line no-console
    for (const browser of browsers) {
        await build(browser);
    }
};

(async function() {
    await buildAll();

    if (watch) {
        fs.watch(indir, { recursive: true }, async function() {
            await buildAll();
        });
    }
})();
