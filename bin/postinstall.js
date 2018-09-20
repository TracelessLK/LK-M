const childProcess = require('child_process')
const path = require('path')
const filePath = path.resolve(__dirname, '../node_modules/react-native/local-cli/core/__fixtures__/files/package.json')
const fs = require('fs')
const rootPath = path.resolve(__dirname, '../')

if (fs.existsSync(filePath)) {
  childProcess.execSync(`
    rm ${filePath};
    `)
}
// fix bug in supports-color
const indexPath = path.resolve(rootPath, 'node_modules/print-message/node_modules/supports-color/index.js')
if (fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, fs.readFileSync(indexPath, 'utf8').replace('var argv = process.argv;', 'var argv = process.argv || [];'))
}

const {ModuleUtil} = require('@ys/collection')
const {installGit} = ModuleUtil

installGit(rootPath)
