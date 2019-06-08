# JsonDiscovery

## Browser extension for discovery json APIs and data

> Now available for Firefox!

Extension based on [Discovery.js](https://github.com/discoveryjs/discovery) which allows you to discover JSON-documents and APIs and make beautiful reports on the fly!

![JsonDiscovery](https://lh3.googleusercontent.com/yZtKr90fS9aOF30d5PyZ-lMrwOIqe0mq13Og6q-BzAU1LgTowkO52WuI5tsgbXx-LUs3XOjKLw=w640-h400-e365)

Download it from:
* [Chrome Web Store](https://chrome.google.com/webstore/detail/discoveryjson/pamhglogfolfbmlpnenhpeholpnlcclo)
* [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/jsondiscovery/)
* [Releases](https://github.com/discoveryjs/browser-extension-json-discovery/releases) section.

### How to install from zip

#### Chrome:

* Navigate to "chrome://extensions/" in the url bar
* Click "Developer mode" in top right corner
* Click "Load unpacked"
* Find the folder where you extracted ZIP file
* That's it!

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
