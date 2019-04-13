const path = require('path')
const childProcess = require('child_process')
const fs = require('fs')
const chalk = require('chalk')

const rootDir = path.resolve(__dirname, '../')
const androidScriptRelativePath = 'local/startAndroid.sh'
const androidScriptPath = path.resolve(rootDir, androidScriptRelativePath)

let cmd
// 如果本地有脚本,运行本地脚本
if (fs.existsSync(androidScriptPath)) {
  cmd = `bash ${androidScriptRelativePath}`
} else {
  cmd = 'react-native run-android'
}

console.log(chalk.blue(`executing: ${cmd}`))

childProcess.execSync(cmd, {
  stdio: [process.stderr, process.stdin, process.stdout]
})
