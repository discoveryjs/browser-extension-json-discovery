const path = require('path');
const fs = require('fs');
const Zip = require('jszip');

const zip = new Zip();
const { version } = require('../package.json');

const outputFile = path.resolve(__dirname, '..', 'build', `jsondiscovery-${version}.zip`);

const BUILD_DIR = 'build';

/**
 * Adds file to archive
 * @param {string} relPath
 */
function addFile(relPath) {
    zip.file(relPath.replace(`${BUILD_DIR}/`, ''), fs.readFileSync(relPath));
}

/**
 * Adds folder to archive
 * @param {string} relPath
 */
function addFolder(relPath) {
    fs.readdirSync(relPath).forEach(function(filename) {
        const fullpath = path.join(relPath, filename);
        if (fs.statSync(fullpath).isDirectory()) {
            addFolder(fullpath);
        } else {
            addFile(fullpath);
        }
    });
}

addFolder(BUILD_DIR);

zip
    .generateNodeStream({
        type: 'nodebuffer',
        streamFiles: true,
        compression: 'DEFLATE'
    })
    .pipe(fs.createWriteStream(outputFile))
    .on('finish', function() {
        console.log('Write result in ' + outputFile); // eslint-disable-line
    });
