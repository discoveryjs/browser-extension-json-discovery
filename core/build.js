const fs = require('fs');
const path = require('path');
const csstree = require('css-tree');
const mime = require('mime');
const crypto = require('crypto');
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

async function build(browser) {
    const outdir = path.join(__dirname, `/../build-${browser}`);

    fs.rmdirSync(outdir, { recursive: true });
    fs.mkdirSync(outdir, { recursive: true });
    fs.writeFileSync(outdir + '/manifest.json', manifest(browser));

    copyFiles(path.join(indir, 'icons'), outdir);

    bundleJs({
        entryPoints: [
            path.join(indir, 'content/index.css'),
            path.join(indir, browser === 'firefox' ? 'content/loader-firefox.js' : 'content/loader.js'),
            path.join(indir, 'content/init-discovery.js')
        ],
        bundle: true,
        // minify: true,
        format: 'esm',
        outdir,
        define: {
            global: 'window'
        }
    })
        .then(() => {
            const css = fs.readFileSync(path.join(outdir, 'index.css'), 'utf8');
            const ast = csstree.parse(css);

            csstree.walk(ast, {
                enter(node) {
                    if (node.type === 'Url') {
                        const value = getValueFromStringOrRaw(node.value);
                        const [, mimeType, content] = value.match(/^data:(.*);base64,(.*)$/);
                        const filename = crypto
                            .createHash('sha1')
                            .update(content)
                            .digest('hex') + '.' + mime.getExtension(mimeType);

                        fs.writeFileSync(path.join(outdir, 'icons', filename), Buffer.from(content, 'base64'));

                        node.value = {
                            type: 'Raw',
                            value: `icons/${filename}`
                        };
                    }
                }
            });

            fs.writeFileSync(path.join(outdir, 'index.css'), csstree.generate(ast));
        })
        .catch((error) => {
            console.error(error); // eslint-disable-line no-console
            process.exit(1);
        });
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

function getValueFromStringOrRaw(node) {
    switch (node.type) {
        case 'String':
            return node.value.substring(1, node.value.length - 1);

        case 'Raw':
            return node.value;
    }

    return null;
}
