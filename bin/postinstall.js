const path = require('path')
const fs = require('fs')
const rootPath = path.resolve(__dirname, '../')
const collection = require('@ys/collection')
const {CliUtil} = collection
const {execSync} = CliUtil
const nodeModule = path.resolve(rootPath, 'node_modules')

// fix bug in supports-color
const indexPathAry = [
  path.resolve(rootPath, 'node_modules/print-message/node_modules/supports-color/index.js'),
  path.resolve(rootPath, 'node_modules/supports-color/index.js')
]
indexPathAry.forEach(ele => {
  if (fs.existsSync(ele)) {
    fs.writeFileSync(ele, fs.readFileSync(ele, 'utf8').replace('var argv = process.argv;', 'var argv = process.argv || [];'))
  }
})

const removePathAry = [
  path.resolve(rootPath, 'node_modules/react-native/local-cli/core/__fixtures__/files/package.json'),
  path.resolve(nodeModule, 'react-native/local-cli/core/__fixtures__/files/package.json'),
  path.resolve(nodeModule, 'print-message/.babelrc')
]

removePathAry.forEach(ele => {
  if (fs.existsSync(ele)) {
    fs.unlink(ele)
    console.log(`remove ${ele}`)
  }
})

// print error sql
execSync('node bin/log.js')
