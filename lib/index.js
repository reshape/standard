const sugarml = require('sugarml')
let expressions = require('reshape-expressions')
let content = require('reshape-content')
let include = require('reshape-include')
let layouts = require('reshape-layouts')
let retext = require('reshape-retext')

module.exports = (options) => {
  if (options.webpack) {
    options.filename = options.webpack.resourcePath
    options.addDependencyTo = options.webpack.addDependencyTo
  }

  const expressionsOpt = selectiveMerge(options, ['delimiters', 'unescapeDelimiters'])
  const layoutsOpt = selectiveMerge(options, ['root', 'addDependencyTo'])
  const includeOpt = selectiveMerge(options, ['root', 'addDependencyTo'])

  return {
    parser: options.sugarml ? sugarml : undefined,
    locals: options.locals,
    filename: options.filename,
    plugins: [
      expressions(expressionsOpt),
      layouts(layoutsOpt),
      content(options.content),
      include(includeOpt),
      retext(options.retext || [])
    ]
  }
}

function selectiveMerge (opts, optNames) {
  return optNames.reduce((m, opt) => {
    if (opts[opt]) { m[opt] = opts[opt] }; return m
  }, {})
}
