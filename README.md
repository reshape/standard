# Reshape Standard Plugin Pack

[![npm](http://img.shields.io/npm/v/spike-html-standards.svg?style=flat)](https://badge.fury.io/js/spike-html-standards) [![tests](http://img.shields.io/travis/static-dev/spike-html-standards/master.svg?style=flat)](https://travis-ci.org/static-dev/spike-html-standards) [![dependencies](http://img.shields.io/david/static-dev/spike-html-standards.svg?style=flat)](https://david-dm.org/static-dev/spike-html-standards) [![coverage](http://img.shields.io/coveralls/static-dev/spike-html-standards.svg?style=flat)](https://coveralls.io/github/static-dev/spike-html-standards)

[Spike html standards](https://spike.readme.io/docs/html-standards) plugin pack for reshape

> **Note:** This project is in8 early development, and versioning is a little different. [Read this](http://markup.im/#q4_cRZ1Q) for more details.

### Installation

`npm install spike-html-standards -S`

> **Note:** This project is compatible with node v6+ only

### Usage

This is nothing more than a light wrapper around a bundle of plugins. Options are filtered into their appropriate plugins internally. All are optional.

```js
const reshape = require('reshape')
const htmlStandards = require('spike-html-standards')

reshape({
  plugins: htmlStandards({
    // root used to resolve layouts and includes
    root: '/path/to/root'
    // webpack dependency adds for layouts and includes
    addDependencyTo: { addDependency: (x) => x }
    // custom delimiters for expressions
    delimiters: ['<%=', '%>']
    unescapeDelimiters: ['<%-', '%>']
    // options passed directly to content transform plugin
    content: { md: (x) => x }
    // plugins passed directly to retext plugin
    retext: [plugin, otherPlugin]
  })
})
```

### License & Contributing

- Details on the license [can be found here](LICENSE.md)
- Details on running tests and contributing [can be found here](contributing.md)
