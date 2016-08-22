const sugarml = require('sugarml')
const smartypants = require('retext-smartypants')
let MarkdownIt = require('markdown-it')
let expressions = require('reshape-expressions')
let content = require('reshape-content')
let include = require('reshape-include')
let layouts = require('reshape-layouts')
let retext = require('reshape-retext')

module.exports = function spikeHtmlStandards (options = {}) {
  // set options using webpack shortcut if present
  if (options.webpack) {
    options.filename = options.webpack.resourcePath
    options.addDependencyTo = options.webpack
  }

  // add options for expressions, layouts, and includes if present
  const expressionsOpt = selectiveMerge(options, ['delimiters', 'unescapeDelimiters'])
  const layoutsOpt = selectiveMerge(options, ['root', 'addDependencyTo'])
  const includeOpt = selectiveMerge(options, ['root', 'addDependencyTo'])

  // if the user has not provided a custom parser or `false`, use sugarml
  let parserOpt = options.parser || sugarml
  if (options.parser === false) parserOpt = undefined

  // If the user has not overridden the default markdown function, initialize
  // markdown-it and add the default
  let contentOpt = options.content || {}
  if (!contentOpt.md) {
    const markdownOpt = { typographer: true, linkify: true }
    const md = new MarkdownIt(Object.assign({}, markdownOpt, options.markdown))
    contentOpt.md = md.renderInline.bind(md)
  }

  return {
    parser: parserOpt,
    locals: options.locals,
    filename: options.filename,
    plugins: [
      expressions(expressionsOpt),
      layouts(layoutsOpt),
      content(contentOpt),
      include(includeOpt),
      retext(options.retext || smartypants)
    ]
  }
}

function selectiveMerge (opts, optNames) {
  return optNames.reduce((m, opt) => {
    if (opts[opt]) { m[opt] = opts[opt] }; return m
  }, {})
}
