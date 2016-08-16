# Spike HTML Standard Plugin Pack

[![npm](http://img.shields.io/npm/v/spike-html-standards.svg?style=flat)](https://badge.fury.io/js/spike-html-standards) [![tests](http://img.shields.io/travis/static-dev/spike-html-standards/master.svg?style=flat)](https://travis-ci.org/static-dev/spike-html-standards) [![dependencies](http://img.shields.io/david/static-dev/spike-html-standards.svg?style=flat)](https://david-dm.org/static-dev/spike-html-standards) [![coverage](http://img.shields.io/coveralls/static-dev/spike-html-standards.svg?style=flat)](https://coveralls.io/github/static-dev/spike-html-standards)

[Spike html standards](https://spike.readme.io/docs/html-standards) plugin pack for reshape

> **Note:** This project is in early development, and versioning is a little different. [Read this](http://markup.im/#q4_cRZ1Q) for more details.

### Installation

`npm install spike-html-standards -S`

> **Note:** This project is compatible with node v6+ only

### Usage

This is nothing more than a light wrapper around a bundle of plugins. Options are filtered into their appropriate plugins internally. All are optional.

```js
const reshape = require('reshape')
const htmlStandards = require('spike-html-standards')

reshape({
  plugins: htmlStandards(/* options */)
})
```

By default, the html standard plugin pack includes:

- [sugarml](https://github.com/reshape/sugarml), provided as default parser
- [reshape-expressions](https://github.com/reshape/expressions), default settings
- [reshape-layouts](https://github.com/reshape/layouts), default settings
- [reshape-include](https://github.com/reshape/include), default settings
- [reshape-content](https://github.com/reshape/content) with a `md` function that renders markdown using [markdown-it](https://github.com/markdown-it/markdown-it)
- [reshape-retext](https://github.com/reshape/retext) with the [smartypants](https://github.com/wooorm/retext-smartypants) plugin

Any of these plugins can be customized by passing options described below.

### Options

| Name | Description | Default |
| ---- | ----------- | ------- |
| **root** | Root path used to resolve layouts and includes | |
| **filename** | Name of the file being compiled, used for error traces and as the include/layout root if not otherwise provided | |
| **addDependencyTo** | Object with `addDependency` method that will get file paths for tracked deps from includes/layouts | |
| **webpack** | Shortcut for webpack users to set the `root` and `addDependencyTo` options more easily. Pass webpack loader context. | |
| **delimiters** | Delimiters used for html-escaped expressions | `['{{', '}}']` |
| **unescapeDelimiters** | Delimiters used for unescaped expressions | `['{{{', '}}}']` |
| **markdown** | Options passed in to [markdown-it](https://github.com/markdown-it/markdown-it) constructor | `{ typographer: true, linkify: true }` |
| **content** | Options passed to the [reshape-content](https://github.com/reshape/content) plugin | `{ md: renderMarkdown }` |
| **parser** | custom html parser if desired. pass `false` to use the default html parser | `sugarml` |
| **retext** | Plugins to be passed to the [reshape-retext](https://github.com/reshape/retext) plugin | `[smartypants]` ([ref](https://github.com/wooorm/retext-smartypants)) |
| **locals** | Added directly to the output object, used when compiling a reshape template to html | `{}` |

### License & Contributing

- Details on the license [can be found here](LICENSE.md)
- Details on running tests and contributing [can be found here](contributing.md)
