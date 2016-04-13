
# resizable-drawer.js [![Build Status](https://img.shields.io/travis/bsara/resizable-drawer.js.svg)](https://travis-ci.org/bsara/resizable-drawer.js?style=flat-square)


[![CPOL v1.02 License](https://img.shields.io/badge/license-CPOL--1.02-blue.svg?style=flat-square)](https://github.com/bsara/resizable-drawer.js/blob/master/LICENSE.md)

[![NPM Package](https://img.shields.io/npm/v/resizable-drawer.svg?style=flat-square)](https://www.npmjs.com/package/resizable-drawer)&nbsp;
[![Bower Package](https://img.shields.io/bower/v/resizable-drawer.svg?style=flat-square)](http://bower.io/search/?q=resizable-drawer)


A simple implementation of a resizable drawer using only native JS and CSS.

Includes support for AMD, CommonJS, and global inclusion via an HTML script tag
and is **mobile friendly!**.



## Install

- **NPM:** `$ npm install --save resizable-drawer`
- **Bower:** `$ bower install --save resizable-drawer`
- **CDN - ES6:**
  - `<script src="//npmcdn.com/resizable-drawer@1.0.0-beta.3/dist/resizable-drawer.js"></script>`
  - `<link rel="stylesheet" type="text/css" src="//npmcdn.com/resizable-drawer@1.0.0-beta.3/dist/resizable-drawer.min.css">`
- **CDN - ES5:**
  - `<script src="//npmcdn.com/resizable-drawer@1.0.0-beta.3/dist/resizable-drawer.es5.js"></script>`
  - `<link rel="stylesheet" type="text/css" src="//npmcdn.com/resizable-drawer@1.0.0-beta.3/dist/resizable-drawer.min.css">`
- [**Download**](https://github.com/bsara/resizable-drawer.js/releases)


## Basic Usage

[**JS Bin Demo**](http://output.jsbin.com/rokuyu)

#### JavaScript

```javascript
import ResizableDrawer from 'resizable-drawer';


let myResizableDrawer = new ResizableDrawer(document.querySelector('#myResizableDrawerElement'));

...

myResizableDrawer.destroy();
```

#### HTML

```html
<link rel="stylesheet" type="text/css" src="resizable-drawer.min.css">

...

<div id="myResizableDrawerElement" class=".resizable-drawer">
  <div class="resizable-drawer-content">...</div>
  <div class="resizable-drawer-handle">&hellip;</div>
</div>
```


## Advanced Usage

#### JavaScript

```javascript
import ResizableDrawer from 'resizable-drawer';


let myResizableDrawer = new ResizableDrawer({
  el:                    document.querySelector('#myResizableDrawerElement'),
  contentOriginalHeight: 250,
  contentMinHeight:      150,
  startEnabled:          false,
  startOpen:             false
});

...

myResizableDrawer.destroy();
```

#### HTML

```html
<link rel="stylesheet" type="text/css" src="resizable-drawer.min.css">

...

<div id="myResizableDrawerElement" class=".resizable-drawer">
  <div class="resizable-drawer-content">...</div>
  <div class="resizable-drawer-handle">&hellip;</div>
</div>
```



## Building the Project

The project is built using [Gulp.js](http://gulpjs.com/). To install
Gulp.js, see [the Gulp.js "Getting Started" docs](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md).

Run the following at the root of the project for a list of available
gulp tasks:

    $ gulp help
