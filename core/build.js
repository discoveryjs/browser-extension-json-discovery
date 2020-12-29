const fs = require('fs');
const path = require('path');
const bundleJs = require('esbuild').build;
const { bundleCss } = require('@discoveryjs/cli').build;
// const manifestBase = require('../src/manifest.js');
// const manifestFirefox = require('../src/manifest-firefox.js');

const indir = path.join(__dirname, '/../src');
const outdir = path.join(__dirname, '/../build-chrome');
const isolateOptions = {
    isolate: true
};

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

async function build(outdir) {
    const isolate = 'xxx';
    // const { content: css, isolate } = await bundleCss(indir + '/index.css', isolateOptions);
    // fs.mkdirSync(outdir, { recursive: true });
    // fs.writeFileSync(outdir + '/inject.css', css);
    copyFiles(path.join(indir, 'manifest.json'), outdir);
    copyFiles(path.join(indir, 'icons'), outdir);

    bundleJs({
        entryPoints: [
            path.join(indir, 'content/index.css'),
            path.join(indir, 'content/inject.js')
        ],
        loader: { '.png': 'file' },
        bundle: true,
        minify: true,
        outdir,
        define: {
            ISOLATE_STYLE_MARKER: JSON.stringify(isolate)
        }
    }).catch(() => process.exit(1));
}

build(outdir);

// const chromeConfig = config({
//     manifest: manifestBase,
//     outputPath: 'build-chrome'
// });
// const firefoxConfig = config({
//     manifest: manifestFirefox,
//     outputPath: 'build-firefox'
// });
// const safariConfig = config({
//     entry: resolve('./content/inject-safari'),
//     outputPath: 'safari/JsonDiscovery/JsonDiscovery Extension',
//     staticCopy: false
// });
