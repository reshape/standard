const test = require('ava')
const rewire = require('rewire')
const htmlStandards = rewire('..')

test('options passed correctly', (t) => {
  htmlStandards.__set__('content', (opts) => {
    t.truthy(opts.md === 'test')
  })
  htmlStandards.__set__('include', (opts) => {
    t.truthy(opts.root === 'test')
    t.truthy(opts.addDependencyTo === 'test')
  })
  htmlStandards.__set__('layouts', (opts) => {
    t.truthy(opts.root === 'test')
    t.truthy(opts.addDependencyTo === 'test')
  })
  htmlStandards.__set__('expressions', (opts) => {
    t.truthy(opts.delimiters === 'test')
    t.truthy(opts.unescapeDelimiters === 'test')
  })
  htmlStandards.__set__('retext', (opts) => {
    t.truthy(opts.length === 3)
  })

  const out = htmlStandards({
    sugarml: true,
    root: 'test',
    webpack: { resourcePath: 'test', addDependencyTo: 'test' },
    delimiters: 'test',
    locals: 'true',
    unescapeDelimiters: 'test',
    content: { md: 'test' },
    retext: [1, 2, 3]
  })

  t.truthy(out.parser)
  t.truthy(out.locals)
  t.truthy(out.filename === 'test')
  t.truthy(out.plugins.length === 5)
})
