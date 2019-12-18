#!/bin/sh
./node_modules/.bin/webpack --config ./core/webpack.prod.js -p --progress  --hide-modules --colors --info-verbosity verbose --env.target 0
./node_modules/.bin/webpack --config ./core/webpack.prod.js -p --progress  --hide-modules --colors --info-verbosity verbose --env.target 1
./node_modules/.bin/webpack --config ./core/webpack.prod.js -p --progress  --hide-modules --colors --info-verbosity verbose --env.target 2