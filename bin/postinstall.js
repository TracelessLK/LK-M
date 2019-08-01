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

const recordPath = path.resolve(nodeModule, 'react-native-audio-recorder-player/index.js')
const commentOutAry = [`console.log('milisecs: ' + milisecs);`,
  `console.log('Already started playing');`,
  `console.log('min: ' + minutes + ', secs: ' + seconds + ', ' + miliseconds);`]

commentOutAry.forEach(ele => {
  fs.writeFileSync(recordPath, fs.readFileSync(recordPath, 'utf8').replace(ele, ''))
})

const removePathAry = [
  path.resolve(rootPath, 'node_modules/react-native/local-cli/core/__fixtures__/files/package.json'),
  path.resolve(nodeModule, 'react-native/local-cli/core/__fixtures__/files/package.json'),
  path.resolve(nodeModule, 'print-message/.babelrc')
]

removePathAry.forEach(ele => {
  if (fs.existsSync(ele)) {
    fs.unlink(ele, (err) => {
      if (err) {
        throw err
      }
    })
    console.log(`remove ${ele}`)
  }
})

// print error sql
execSync('node bin/log.js')
//add eslint support for LK-C
execSync(`git submodule init && git submodule update --remote && npm i`, {
  cwd: path.resolve(rootPath, 'submodule/LK-C')
})
console.log('postinstall finished')
