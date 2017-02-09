const sugarml = require('sugarml')
const smartypants = require('retext-smartypants')
let MarkdownIt = require('markdown-it')
let expressions = require('reshape-expressions')
let content = require('reshape-content')
let include = require('reshape-include')
let layouts = require('reshape-layouts')
let retext = require('reshape-retext')
let beautify = require('reshape-beautify')
let minify = require('reshape-minify')

module.exports = function reshapeStandard (options = {}) {
  // add options for expressions, layouts, and includes if present
  const expressionsOpt = selectiveMerge(options, ['delimiters', 'unescapeDelimiters'])
  const layoutsOpt = selectiveMerge(options, ['root'])
  const includeOpt = selectiveMerge(options, ['root', 'alias'])

  // if the user has not provided a custom parser or `false`, use sugarml
  let parserOpt = options.parser || sugarml
  if (options.parser === false) parserOpt = undefined

  // Always return an object for locals
  if (typeof options.locals === 'undefined') options.locals = {}

  // If the user has not overridden the default markdown function, initialize
  // markdown-it and add the default
  let contentOpt = options.content || {}
  if (!contentOpt.md) {
    const markdownOpt = { typographer: true, linkify: true }
    const md = new MarkdownIt(Object.assign({}, markdownOpt, options.markdown))
    contentOpt.md = md.render.bind(md)
    contentOpt.mdi = md.renderInline.bind(md)
  }

  const plugins = [
    layouts(layoutsOpt),
    include(includeOpt),
    expressions(expressionsOpt),
    content(contentOpt),
    retext(options.retext || smartypants)
  ]

  if (options.minify) {
    plugins.push(minify())
  } else {
    plugins.push(beautify())
  }

  return {
    parser: parserOpt,
    locals: options.locals,
    filename: options.filename,
    plugins
  }
}

function selectiveMerge (opts, optNames) {
  return optNames.reduce((m, opt) => {
    if (typeof opts[opt] !== 'undefined') { m[opt] = opts[opt] }; return m
  }, {})
}
