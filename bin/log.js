const path = require('path')

const rootPath = path.resolve(__dirname, '../')

const sqliteCore = path.resolve(rootPath, 'node_modules/react-native-sqlite-storage/lib/sqlite.core.js')
const fse = require('fs-extra')

const before = 'let errorMsg = JSON.stringify(err);'
const after = before + 'console.log(batchExecutes);console.log(err)'
const originalContent = fse.readFileSync(sqliteCore, 'utf8')

if (!originalContent.includes(after)) {
  fse.writeFileSync(sqliteCore, originalContent.replace(before, after))
}
