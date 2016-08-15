const expressions = require('reshape-expressions')
const content = require('reshape-content')
const include = require('reshape-include')
const layouts = require('reshape-layouts')
const retext = require('reshape-retext')

module.exports = (options) => {
  const expressionsOpt = selectiveMerge({}, options, ['delimiters', 'unescapeDelimiters'])
  const layoutsOpt = selectiveMerge({}, options, ['root', 'addDependencyTo'])
  const includeOpt = selectiveMerge({}, options, ['root', 'addDependencyTo'])

  return [
    expressions(expressionsOpt),
    layouts(layoutsOpt),
    content(options.content),
    include(includeOpt),
    retext(options.retext)
  ]
}

function selectiveMerge (opts, optNames) {
  return optNames.reduce((m, opt) => {
    if (opts[opt]) { m[opt] = opts[opt] }; return m
  }, {})
}
