const path = require('path')
const fs = require('fs')
const clipboardy = require('clipboardy')

const rootDir = path.resolve(__dirname, '../../')
const ary = fs.readdirSync(path.resolve(rootDir, 'resource/animations'))
const obj = ary.reduce((accumulator, curVal) => {
  if (!curVal.startsWith('.')) {
    accumulator[`'${curVal.replace('.json', '')}'`] = `require('../../../../../resource/animations/${curVal}')`
  }
  return accumulator
}, {})

clipboardy.writeSync(JSON.stringify(obj, null, 2).replace(/"/g, ''))
console.log('copyed to clipboard')
