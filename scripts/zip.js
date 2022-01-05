const path = require('path');
const fs = require('fs');
const Zip = require('jszip');

const zip = new Zip();
const { version } = require('../package.json');

const TARGETS = {
    chrome: 'build-chrome',
    firefox: 'build-firefox'
};

const outputFile = (target, buildDir) =>
    path.resolve(__dirname, '..', buildDir, `jsondiscovery-${target}-${version}.zip`);

const makeAddFile = relDir => relPath => zip.file(relPath.replace(`${relDir}/`, ''), fs.readFileSync(relPath));

/**
 * Adds folder to archive
 * @param {string} relPath
 * @param {Function} addFile
 */
function addFolder(relPath, addFile) {
    fs.readdirSync(relPath).forEach(function(filename) {
        const fullpath = path.join(relPath, filename);
        if (fs.statSync(fullpath).isDirectory()) {
            addFolder(fullpath, addFile);
        } else {
            addFile(fullpath);
        }
    });
}

for (const [target, buildDir] of Object.entries(TARGETS)) {
    const addFile = makeAddFile(buildDir);

    addFolder(buildDir, addFile);

    zip
        .generateNodeStream({
            type: 'nodebuffer',
            streamFiles: true,
            compression: 'DEFLATE'
        })
        .pipe(fs.createWriteStream(outputFile(target, buildDir)))
        .on('finish', function() {
            console.log('Write result in ' + outputFile(target, buildDir)); // eslint-disable-line
        });
}
