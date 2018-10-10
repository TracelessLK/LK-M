const path = require('path')
const filePath = path.resolve(__dirname, '../node_modules/react-native/local-cli/core/__fixtures__/files/package.json')
const fs = require('fs')
const rootPath = path.resolve(__dirname, '../')
const collection = require('@ys/react-native-collection')
const {CliUtil, ModuleUtil} = collection
const {execSync} = CliUtil

if (fs.existsSync(filePath)) {
  execSync(`
    rm ${filePath};
    `)
}
// fix bug in supports-color
const indexPath = path.resolve(rootPath, 'node_modules/print-message/node_modules/supports-color/index.js')
if (fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, fs.readFileSync(indexPath, 'utf8').replace('var argv = process.argv;', 'var argv = process.argv || [];'))
}

// print error sql
execSync('node bin/log.js')

const {installGit} = ModuleUtil

// installGit(rootPath)
