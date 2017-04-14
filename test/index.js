const test = require('ava')
const rewire = require('rewire')
const standardRewired = rewire('..')
const standard = require('..')

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

test('defaults come out right', (t) => {
  const out = standard()
  t.truthy(out.parser.name === 'SugarMLParser')
  t.truthy(Object.keys(out.locals).length === 0)
  t.truthy(out.filename === undefined)
  t.truthy(out.plugins.length === 6)
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
  standardRewired()
  undo()
})

test('retext default', (t) => {
  const undo = standardRewired.__set__('retext', (opts) => {
    t.truthy(typeof opts === 'function')
  })
  standardRewired()
  undo()
})

test('parser false', (t) => {
  const out = standard({ parser: false })
  t.truthy(out.parser === undefined)
})

test('alternate parser', (t) => {
  const out = standard({ parser: 'test' })
  t.truthy(out.parser === 'test')
})

test('passed locals', (t) => {
  const out = standard({ locals: 'test' })
  t.truthy(out.locals === 'test')
})

test('minify option', (t) => {
  const out = standard({ minify: true })
  t.truthy(out.plugins[out.plugins.length - 1].name === 'minifyPlugin')
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
