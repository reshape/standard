const test = require('ava')
const rewire = require('rewire')
const standardRewired = rewire('..')
const standard = require('..')

test('options passed correctly', (t) => {
  standardRewired.__set__('content', (opts) => {
    t.truthy(opts.md === 'test')
  })
  standardRewired.__set__('include', (opts) => {
    t.truthy(opts.root === 'test')
    t.truthy(opts.alias === 'test')
  })
  standardRewired.__set__('layouts', (opts) => {
    t.truthy(opts.root === 'test')
  })
  standardRewired.__set__('expressions', (opts) => {
    t.truthy(opts.delimiters === 'test')
    t.truthy(opts.unescapeDelimiters === 'test')
  })
  standardRewired.__set__('retext', (opts) => {
    t.truthy(opts.length === 3)
  })
  standardRewired.__set__('MarkdownIt', class Mock {
    constructor (opts) {
      t.truthy(opts === 'test')
    }
  })

  const out1 = standardRewired({
    root: 'test',
    webpack: true,
    delimiters: 'test',
    locals: 'true',
    alias: 'test',
    unescapeDelimiters: 'test',
    content: { md: 'test' },
    retext: [1, 2, 3],
    markdown: 'test'
  })

  const out2 = standard({
    parser: false,
    addDependencyTo: { addDependency: (x) => x },
    locals: 'true',
    minify: true
  })

  t.truthy(out1.parser)
  t.truthy(out1.locals)
  t.truthy(!out1.filename)
  t.truthy(out1.plugins.length === 6)
  t.falsy(out2.parser)
  t.truthy(out2.plugins[out2.plugins.length - 1].name === 'minifyPlugin')
})
