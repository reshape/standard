# Reshape Standard Plugin Pack

[![npm](http://img.shields.io/npm/v/reshape-standard.svg?style=flat)](https://badge.fury.io/js/reshape-standard) [![tests](http://img.shields.io/travis/reshape/standard/master.svg?style=flat)](https://travis-ci.org/reshape/standard) [![dependencies](http://img.shields.io/david/reshape/standard.svg?style=flat)](https://david-dm.org/reshape/standard) [![coverage](http://img.shields.io/coveralls/reshape/standard.svg?style=flat)](https://coveralls.io/github/reshape/standard)

A standard, opinionated plugin pack for reshape

> **Note:** This project is in early development, and versioning is a little different. [Read this](http://markup.im/#q4_cRZ1Q) for more details.

### Installation

`npm install reshape-standard -S`

> **Note:** This project is compatible with node v6+ only

### Example

The standard plugin pack includes plugins that cover all the features needed from a modern template engine. Below is an example of a page utilizing many of the features:

```jade
doctype html
html
  head
    title Standard Example
  body
    h1 Hello world!

    ul#nav
      li.active: a(href='#') home
      li: a(href='#') about

    include(src='_welcome_message.sgr')

    p local variable: {{ foo }}

    each(loop='item of items')
      if(condition='item.name')
        p {{ item.name }}
      else
        p item with no name!

    p(mdi) **Look** at this [markdown](https://daringfireball.net/projects/markdown/)
```

Note that it is easily possible to configure any of the options. If you don't like the whitespace syntax, you can flip it off with `parser: false` and use the same features with standard `<html>` syntax. If you don't like the `{{ }}` delimiters, you can quickly and easily change them. See the options below for more!

### Usage

This is nothing more than a light wrapper around a reshape configuration object. Options are filtered into their appropriate plugins internally. All are optional.

```js
const reshape = require('reshape')
const standard = require('reshape-standard')

reshape(standard(/* options */))
  .process(someHtml)
  .then((res) => console.log(res.output()))
```

By default, the standard plugin pack includes:

- [sugarml](https://github.com/reshape/sugarml), provided as default parser
- [reshape-expressions](https://github.com/reshape/expressions), default settings
- [reshape-layouts](https://github.com/reshape/layouts), default settings
- [reshape-include](https://github.com/reshape/include), default settings
- [reshape-content](https://github.com/reshape/content) with `md` and `mdi` functions that render markdown using [markdown-it](https://github.com/markdown-it/markdown-it)
- [reshape-retext](https://github.com/reshape/retext) with the [smartypants](https://github.com/wooorm/retext-smartypants) plugin
- [reshape-beautify](https://github.com/reshape/beautify), default settings
- [reshape-minify](https://github.com/reshape/minify), toggled with the `minify` option which is false by default. When enabled, it will disable `beautify`

Based on the way they are ordered there are a couple limitations to keep in mind:

- You cannot use a layout `block/extend` inside of an `include`
- Any expression delimiters rendered from a `content` or `retext` transform will be output as plaintext, not as an expression
- Output from a `content` transform will be processed by `retext` in that order

Any of these plugins can be customized by passing options described below.

### Options

| Name | Description | Default |
| ---- | ----------- | ------- |
| **root** | Root path used to resolve layouts and includes | |
| **filename** | Name of the file being compiled, used for error traces and as the include/layout root if not otherwise provided | |
| **delimiters** | Delimiters used for html-escaped expressions | `['{{', '}}']` |
| **unescapeDelimiters** | Delimiters used for unescaped expressions | `['{{{', '}}}']` |
| **markdown** | Options passed in to [markdown-it](https://github.com/markdown-it/markdown-it) constructor | `{ typographer: true, linkify: true }` |
| **markdownPlugins** | Plugins to be loaded by [markdown-it](https://github.com/markdown-it/markdown-it) parser. See below for more details. | |
| **content** | Options passed to the [reshape-content](https://github.com/reshape/content) plugin | `{ md: renderMarkdown, mdi: renderMarkdownInline }` |
| **parser** | custom html parser if desired. pass `false` to use the default html parser | `sugarml` |
| **retext** | Plugins to be passed to the [reshape-retext](https://github.com/reshape/retext) plugin | `[smartypants]` ([ref](https://github.com/wooorm/retext-smartypants)) |
| **locals** | Added directly to the output object, used when compiling a reshape template to html | `{}` |
| **alias** | Alias option to be passed to the [include plugin](https://github.com/reshape/include#options) | |
| **parserRules** | Parser rules to be passed to the [include plugin](https://github.com/reshape/include#options) | |
| **minify** | Minifies the html output by removing excess spaces and line breaks | `false` |
| **appendPlugins** | Adds a single plugin or array of plugins after all the defaults | |
| **prependPlugins** | Adds a single plugin or array of plugins before all the defaults | |

### Markdown Rendering Functions

There are two markdown rendering shortcut functions provided with this plugin pack: `md` and `mdi`. The `md` function will run a full markdown render including wrapping with a paragraph tag, rendering headlines, etc. For example:

```
.content(md).
  # The title

  Here's some text, wow.

  A second paragraph!
```

This would work as expected, rendering title and paragraph tags:

```
<div class='content'>
  <h1>The title</h1>
  <p>Here's some text, wow.</p>
  <p>A second paragraph!</p>
</div>
```

The `mdi` shortcut is specifically for rendering _inline_ markdown, not including any type of title tags or paragraph wrapping. So for example:

```
p(mdi) Hello, I am #1 and this is [my link](#).
```

Would render without additional paragraph wrappings or unexpected title renders:

```
<p> Hello, I am #1 and this is <a href='#'>my link</a>.
```

### Markdown Plugins

You can pass an array of [markdown-it plugins](https://www.npmjs.com/browse/keyword/markdown-it-plugin) via the `markdownPlugins` option with or without their own options.

```js
const reshape = require('reshape')
const standard = require('reshape-standard')
const emoji = require('markdown-it-emoji')
const anchor = require('markdown-it-anchor')
const toc = require('markdown-it-table-of-contents')

reshape(standard(markdownPlugins: [
  emoji,
  anchor,
  [toc, { containerClass: 'toc' }]
]))
  .process(someHtml)
  .then((res) => console.log(res.output()))
```

### License & Contributing

- Details on the license [can be found here](LICENSE.md)
- Details on running tests and contributing [can be found here](contributing.md)
