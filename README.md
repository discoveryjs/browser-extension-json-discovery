# JsonDiscovery

## Browser extension that changes the way you\'re viewing JSON

> Now available for Firefox!

Extension based on [Discovery.js](https://github.com/discoveryjs/discovery) which allows you to discover JSON-documents and APIs and make beautiful reports on the fly!

![JsonDiscovery](https://hsto.org/webt/ea/f1/rw/eaf1rwvh6zugx3rotnwttvvepjq.png)

Download it from:
* [Chrome Web Store](https://chrome.google.com/webstore/detail/discoveryjson/pamhglogfolfbmlpnenhpeholpnlcclo)
* [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/jsondiscovery/)
* [Releases](https://github.com/discoveryjs/browser-extension-json-discovery/releases) section.

## Most exciting features:
- Show JSON as an interactive tree with highlighting
- Easy an object or an array copy to clipboard
- Data structure signature (like in TypeScript)
- Data transformation with a query using Jora, suggestions on a query typing
- Customisation of JSON data presentation (using tables, lists and so on)
- Customisation (report) sharing by a link
- Works on any page with a valid JSON – URL/content type doesn't matter
- Works on local files (see below)
- Works offline (doesn't perform any network request)

Read more on [Medium](https://blog.usejournal.com/changing-a-way-were-viewing-json-in-a-browser-51eda9103fa2) or on [Habr (in Russian)](https://habr.com/ru/post/461185/)

### How to install from zip

#### Chrome:

* Navigate to "chrome://extensions/" in the url bar
* Click "Developer mode" in top right corner
* Click "Load unpacked"
* Find the folder where you extracted ZIP file
* That's it!

##### Working with local files

* Navigate to chrome://extensions
* Find JsonDiscovery
* Click "Details" button
* Toggle "Allow access to file URLs" switch

#### Firefox:

* Navigate to "about:debugging" in the URL bar
* Click "Load Temporary Add-on"
* Find the folder containing extension ZIP archive and select it
* That's it!

##### Firefox default JSON viewer

By default Firefox uses its own JSON viewer. To disable it you should:

* Navigate to "about:config"
* In search field type 'devtools.jsonview.enabled'
* Toggle this setting to false

### Development

For local development clone repository, run `npm install` inside repo directory and start local development server with `npm run dev` command.

Install builded extension to your browser from `build-chrome` or `build-firefox` directories.
