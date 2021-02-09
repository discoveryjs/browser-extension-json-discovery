## 1.10.0 (09-02-2020)

* Build system reworked using `esbuild`
* Fixed bug with darkmode styles applied to the part of the page in Chrome
* Fixed darkmode "blinking" issue
* Disabled "inspector" when you press `Alt` button
* Fixed bug when you have to reload page to apply settings
* Increased performance by splitting code loading into two stages (Chrome & Safari only)
* Style isolation via ShadowDOM
* Fixed issues when CSP blocked some images and icons
* Updated `discovery` to `1.0.0-beta.53`

## 1.9.2 (12-11-2020)

* Updated `discovery` to `1.0.0-beta.50`

## 1.9.1 (08-11-2020)

* Fixed `raw` mode css
* Improved raw copy to clipboard performance
* Flash message moved to the right bottom corner

## 1.9.0 (07-11-2020)

* "Download JSON" button
* Fixed `raw` mode css

## 1.8.1 (06-11-2020)

* Fixed bug with hidden `pre` on some sites
* Fixed bug with non-working `raw` mode

## 1.8.0 (03-11-2020)

* Increased performance when working with huge JSON-documents
* Updated `discovery` to `1.0.0-beta.47`
* Fixed table font color

## 1.7.1 (21-10-2020)

* Updated `discovery` to `1.0.0-beta.45`
* Fixed CSP-related crash on some pages

## 1.7.0 (21-10-2020)

* Updated `discovery` to `1.0.0-beta.44`
* Updated `discovery-cli` to `1.14.0`
* Dark mode support

## 1.6.6 (06-10-2020)

* Removed settings button from the burger menu

## 1.6.5 (04-10-2020)

* Updated `discovery` to `1.0.0-beta.40`
* Updated `discovery-cli` to `1.13.0`

## 1.6.4 (17-05-2020)

* Updated `discovery` to `1.0.0-beta.36`
* Updated `discovery-cli` to `1.9.1`

## 1.6.3 (25-04-2020)

* CSS style isolation marker by CSS content hash
* Updated `discovery` to `1.0.0-beta.31`
* Updated `discovery-cli` to `1.8.1`

## 1.6.2 (18-02-2020)

* Updated `discovery` to `1.0.0-beta.30`
* CSS style isolation via `discovery-cli`
* Fixed issue with suggestion popup on `report` page

## 1.6.1 (18-02-2020)

* Updated `discovery` to `1.0.0-beta.28` and `jora` to `1.0.0-alpha.13`

## 1.6.0 (18-12-2019)

* Updated `discovery` to `1.0.0-beta.27` [with new `jora` features](https://github.com/discoveryjs/jora/releases/tag/v1.0.0-alpha.11)
* Fixed json parsing in cases when user has browser extensions which inject some content into pages with json

## 1.5.5 (12-12-2019)

* Moved back missed build script
* Fixed plugin initialization issues
* Updated `discovery` to `1.0.0-beta.23`
* Fixed pie charts rendering in FireFox
* Updated npm build deps

## 1.5.4 (11-09-2019)

* Do not use second request, match JSON on markup instead

## 1.5.3 (01-09-2019)

* Fixed false extension triggering on some sites

## 1.5.2 (06-08-2019)

* Fixed style pollution

## 1.5.1 (01-08-2019)

* Fixed issue with broken styles on several sites

## 1.5.0 (30-07-2019)

* Fixed various CSP issues
* Fixed extension malfunction on sites with JSON-like content
* Updated `discovery` to `1.0.0-beta.16` version

## 1.4.3 (30-06-2019)

* Updated `discovery`

## 1.4.2 (25-05-2019)

* Extension now available for Firefox
* Refactored build for multiple targets (Chrome, Firefox)

## 1.4.1 (29-03-2019)

* Settings page now opens in tab instead of pop-up window

## 1.4.0 (09-03-2019)

* Settings page is now using `discovery` under hood
* Some pages with CSP-header may brake extension functionality ([Crome bug](https://bugs.chromium.org/p/chromium/issues/detail?id=816121)). For such cases added fallback
* Extension now check if content is HTML before trying to parse JSON

## 1.3.1 (13-02-2019)

* Updated `discovery` and `jora`

## 1.3.0 (26-12-2018)

* Updated `discovery` (new stunning `jora` suggestions on report page)

## 1.2.0 (12-12-2018)

* Updated `discovery` (various buxfixes and some `jora` syntax improvements)

## 1.1.1 (30-11-2018)

* Refactored build process

## 1.1.0 (25-11-2018)

* Replaced bundled discovery with its npm version

## 1.0.7 (23-11-2018)

* Updated discovery and jora
* Fixed issues with raw content copying
* Another navigation issues fix

## 1.0.6 (22-11-2018)

* Views list fix

## 1.0.5 (22-11-2018)

* Updated Discovery
* Fixed issues with navigation

## 1.0.4 (22-11-2018)

* Initial GitHub release
