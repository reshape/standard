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
let reshapeParser = require('reshape-parser')

/**
 * Primary export, formats options and returns an object with intelligent
 * defaults.
 * @param  {Object} [options={}] - options object
 * @param {Array} options.delimiters - passed to expressions plugin
 * @param {Array} options.unescapeDelimiters - passed to expressions plugin
 * @param {String} options.root - passed to layouts & include plugins
 * @param {Object} options.alias - passed to include plugin
 * @param {Object} options.parserRules - passed to include plugin
 * @param {Object|Function} [options.retext=smartypants] - passed to retext
 * plugin
 * @param {Object} [options.content={}] - passed to content plugin
 * @param {Object} options.markdown - passed to markdown-it constructor
 * @param {Object} options.locals - if passed, renders as html string
 * @param {Boolean} options.minify - add minify plugin if true
 * @param {String} options.filename - copied directly to output
 * @param {Function} [options.parser=sugarml] - undefined if false
 * @param {Array|String} options.appendPlugins - appended to plugins array
 * @param {Array|String} options.prependPlugins - prepended to plugins array
 * @return {Object} valid reshape options object
 */
module.exports = function reshapeStandard (options = {}) {
  // add options for expressions, layouts, and includes if present
  const expressionsOpt = selectKeys(options, ['delimiters', 'unescapeDelimiters'])
  const layoutsOpt = selectKeys(options, ['root'])
  const includeOpt = selectKeys(options, ['root', 'alias', 'parserRules'])

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
    // if the user has provided markdown-it plugins, load them into the parser instance
    ;(options.markdownPlugins || []).forEach((plugin) => {
      Array.isArray(plugin) ? md.use(...plugin) : md.use(plugin)
    })
    contentOpt.md = md.render.bind(md)
    contentOpt.mdi = md.renderInline.bind(md)
  }

  // default parserRules if using sugarml correctly import html and svg files
  if (!includeOpt.parserRules && parserOpt === sugarml) {
    includeOpt.parserRules = [{ test: /\.html|svg$/, parser: reshapeParser }]
  }

  // add all the default plugins with their options
  const plugins = [
    layouts(layoutsOpt),
    include(includeOpt),
    expressions(expressionsOpt),
    content(contentOpt),
    retext(options.retext || smartypants)
  ]

  // append and prepend plugins if needed
  if (options.appendPlugins) {
    plugins.push(...Array.prototype.concat(options.appendPlugins))
  }

  if (options.prependPlugins) {
    plugins.unshift(...Array.prototype.concat(options.prependPlugins))
  }

  // append the minify or beautify formatting plugin (always last)
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

/**
 * Given an options object and an array of key names, return an object filtered
 * to contain only the keys in the optNames array, if they exist on the options
 * object.
 * @param  {Object} opts - full options object
 * @param  {Array} optNames - keys to filter
 * @return {Object} object filtered for the specific keys
 */
function selectKeys (opts, optNames) {
  return optNames.reduce((m, opt) => {
    if (typeof opts[opt] !== 'undefined') { m[opt] = opts[opt] }; return m
  }, {})
}
