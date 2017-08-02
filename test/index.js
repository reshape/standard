const test = require('ava')
const rewire = require('rewire')
const standardRewired = rewire('..')
const standard = require('..')
const path = require('path')
const fixtures = path.join(__dirname, 'fixtures')
const reshape = require('reshape')
const fs = require('fs')

test('content options passed correctly', (t) => {
  const undo = standardRewired.__set__('content', (opts) => {
    t.truthy(opts.md === 'test')
  })
  standardRewired({ content: { md: 'test' } })
  undo()
})

test('include options passed correctly', (t) => {
  const undo = standardRewired.__set__('include', (opts) => {
    t.truthy(opts.root === 'test')
    t.truthy(opts.alias === 'test')
    t.truthy(opts.parserRules === 'test')
  })
  standardRewired({ root: 'test', alias: 'test', parserRules: 'test' })
  undo()
})

test('layouts options passed correctly', (t) => {
  const undo = standardRewired.__set__('layouts', (opts) => {
    t.truthy(opts.root === 'test')
  })
  standardRewired({ root: 'test' })
  undo()
})

test('expressions options passed correctly', (t) => {
  const undo = standardRewired.__set__('expressions', (opts) => {
    t.truthy(opts.delimiters === 'test')
    t.truthy(opts.unescapeDelimiters === 'test')
  })
  standardRewired({ delimiters: 'test', unescapeDelimiters: 'test' })
  undo()
})

test('retext options passed correctly', (t) => {
  const undo = standardRewired.__set__('retext', (opts) => {
    t.truthy(opts.length === 3)
  })
  standardRewired({ retext: [1, 2, 3] })
  undo()
})

test('filename passed correctly', (t) => {
  const out = standard({ filename: 'test' })
  t.truthy(out.filename === 'test')
})

test('multi option passed correctly', (t) => {
  const out = standard({ multi: 'test' })
  t.truthy(out.multi === 'test')
})

test('defaults come out right', (t) => {
  const out = standard()
  t.truthy(Object.keys(out.locals).length === 0)
  t.truthy(out.filename === undefined)
  t.truthy(out.plugins.length === 7)
})

test('content defaults', (t) => {
  const undo = standardRewired.__set__('content', (opts) => {
    t.truthy(typeof opts.md === 'function')
    t.truthy(typeof opts.mdi === 'function')
  })
  standardRewired()
  undo()
})

test('parserRules defaults', (t) => {
  const undo = standardRewired.__set__('include', (opts) => {
    t.truthy(opts.parserRules[0].test.exec)
  })
  standardRewired({ parserRules: [{ test: /wow/ }] })
  undo()
})

test('retext default', (t) => {
  const undo = standardRewired.__set__('retext', (opts) => {
    t.truthy(typeof opts === 'function')
  })
  standardRewired()
  undo()
})

test('alternate parser', (t) => {
  const out = standard({ parser: 'test' })
  t.truthy(out.parser === 'test')
})

test('passed locals', (t) => {
  const out = standard({ locals: 'test' })
  t.truthy(out.locals === 'test')
})

test('minify option as a boolean', (t) => {
  const out = standard({ minify: true })
  t.truthy(out.plugins[out.plugins.length - 1].name === 'minifyPlugin')
})

test('minify option as an object', (t) => {
  const out = standard({ minify: { minifySvg: false, foo: 'bar' } })
  t.truthy(out.plugins[out.plugins.length - 1].name === 'minifyPlugin')
})

test('locals option', (t) => {
  const undo = standardRewired.__set__('evalCode', (opts) => {
    t.truthy(opts === true)
  })
  standardRewired({ locals: true })
  undo()
})

test('template option', (t) => {
  const out = standard()
  t.truthy(out.plugins[3].name === 'evalCodePlugin')
  const out2 = standard({ template: true })
  t.falsy(out2.plugins[3].name === 'evalCodePlugin')
})

test('appendPlugins option', (t) => {
  const out = standard({ appendPlugins: ['test'] })
  const out2 = standard({ appendPlugins: 'test' })
  t.truthy(out.plugins[out.plugins.length - 2] === 'test')
  t.truthy(out2.plugins[out.plugins.length - 2] === 'test')
})

test('prependPlugins option', (t) => {
  const out = standard({ prependPlugins: ['test'] })
  const out2 = standard({ prependPlugins: 'test' })
  t.truthy(out.plugins[0] === 'test')
  t.truthy(out2.plugins[0] === 'test')
})

test('markdownPlugins option', (t) => {
  const plugins = [1, 2, 3]
  let count = 0
  function MarkdownIt () {}
  MarkdownIt.prototype.use = (plugin) => {
    t.truthy(plugins[count] === plugin)
    count++
  }
  MarkdownIt.prototype.render = () => {}
  MarkdownIt.prototype.renderInline = () => {}
  const undo = standardRewired.__set__('MarkdownIt', MarkdownIt)
  standardRewired({ markdownPlugins: plugins })
  undo()
})

test('markdownPlugins option with options', (t) => {
  const plugins = [[1, 'options']]
  function MarkdownIt () {}
  MarkdownIt.prototype.use = (plugin, options) => {
    t.truthy(plugins[0][0] === plugin)
    t.truthy(plugins[0][1] === options)
  }
  MarkdownIt.prototype.render = () => {}
  MarkdownIt.prototype.renderInline = () => {}
  const undo = standardRewired.__set__('MarkdownIt', MarkdownIt)
  standardRewired({ markdownPlugins: plugins })
  undo()
})

test('template option turns off evalCode', (t) => {
  const out = standard({ template: true })
  const out2 = standard()
  t.is(out.plugins[3].name, '')
  t.is(out2.plugins[3].name, 'evalCodePlugin')

  const markup = fs.readFileSync(path.join(fixtures, 'index.html'), 'utf8')
  return reshape(out)
    .process(markup)
    .then((res) => {
      t.is(res.output().trim(), '<p>__runtime.escape(“wow <strong>amazing</strong>”)</p>')
    })
})

test('integration', (t) => {
  const markup = fs.readFileSync(path.join(fixtures, 'index.html'), 'utf8')
  return reshape(standard())
    .process(markup)
    .then((res) => {
      t.is(res.output().trim(), '<p>wow <strong>amazing</strong></p>')
    })
})
