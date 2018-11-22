const path = require('path')
const rootDir = path.resolve(__dirname, '../')
const fs = require('fs-extra')
const yarnLock = path.resolve(rootDir, 'yarn.lock')
const {CliUtil} = require('@ys/collection')
const {execSync} = CliUtil

if (fs.existsSync(yarnLock)) {
  execSync('rm yarn.lock')
}
execSync(`yarn install && node bin/postinstall`)
