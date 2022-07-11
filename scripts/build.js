const fs = require('fs');
const path = require('path');
const csstree = require('css-tree');
const mime = require('mime');
const crypto = require('crypto');
const esbuild = require('esbuild');
const manifest = require('../src/manifest.js');

const { NODE_ENV } = process.env;
const watch = NODE_ENV !== 'production';

const indir = path.join(__dirname, '/../src');

const browsers = [
    'chrome',
    'firefox',
    'safari'
];

function processCss(css, outdir, resdir) {
    // CSS post-process
    const ast = csstree.parse(css);

    fs.mkdirSync(path.join(outdir, resdir), { recursive: true });

    csstree.walk(ast, {
        visit: 'Url',
        enter(node) {
            const [, mimeType, content] = node.value.match(/^data:(.*?);base64,(.*)$/);
            const filename = crypto
                .createHash('sha1')
                .update(content)
                .digest('hex') + '.' + mime.getExtension(mimeType);

            fs.writeFileSync(path.join(outdir, resdir, filename), Buffer.from(content, 'base64'));

            node.value = `${resdir}/${filename}`;
        }
    });

    return csstree.generate(ast);
}

async function build(browser) {
    const outdir = path.join(__dirname, `/../build-${browser}`);

    fs.rmSync(outdir, { recursive: true, force: true }); // rm -rf
    fs.mkdirSync(outdir, { recursive: true });
    fs.writeFileSync(outdir + '/manifest.json', manifest(browser));

    copyFiles(path.join(indir, 'icons'), outdir);

    // build bundle
    const result = await esbuild.build({
        entryPoints: [
            path.join(indir, 'background.js'),
            path.join(indir, 'content/discovery.css'),
            path.join(indir, 'content/preloader.css'),
            path.join(indir, 'content/discovery.js'),
            path.join(indir, 'content/init.js')
        ],
        format: 'esm',
        bundle: true,
        minify: true,
        write: false,
        outdir,
        define: {
            global: 'window'
        },
        loader: {
            '.png': 'dataurl',
            '.svg': 'dataurl'
        }
    });

    for (const file of result.outputFiles) {
        const content = path.extname(file.path) === '.css'
            ? processCss(file.text, outdir, 'assets')
            : file.contents;

        const filePath = path.join(outdir, path.basename(file.path));

        fs.writeFileSync(filePath, content);
    }
}

const buildAll = async function() {
    console.log('Building bundles:'); // eslint-disable-line no-console

    for (const browser of browsers) {
        console.log(`  ${browser}...`); // eslint-disable-line no-console

        try {
            await build(browser);
        } catch (e) {
            if (!/esbuild/.test(e.stack)) {
                console.error(e); // eslint-disable-line no-console
            }

            return;
        }
    }

    console.log('  OK'); // eslint-disable-line no-console
};

(async function() {
    await buildAll();

    if (watch) {
        const lastChange = new Map();

        fs.watch(indir, { recursive: true }, function(_, fn) {
            const mtime = Number(fs.statSync(path.join(indir, fn)).mtime);

            // avoid build when file doesn't changed but event is received
            if (lastChange.get(fn) !== mtime) {
                lastChange.set(fn, mtime);
                buildAll();
            }
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
