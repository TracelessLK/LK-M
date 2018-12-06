const {CliUtil} = require('@ys/collection')
const {execSync} = CliUtil
const path = require('path')
const rootDir = path.resolve(__dirname, '../')
const config = require(path.resolve(rootDir, 'config/devConfig'))
const {udid} = config

let cmd

if (udid) {
  cmd = `
react-native run-ios --udid ${udid}
`
} else {
  // todo: parse instruments -s
  throw new Error(`uuid is not configed`)
}
console.log('starting....')
execSync(cmd)

console.log('app started successfully')
