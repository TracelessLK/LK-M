let fs, node_ssh, ssh

fs = require('fs')
node_ssh = require('node-ssh')
ssh = new node_ssh()
const path = require('path')
const argv = require('yargs').argv
const fse = require('fs-extra')
const config = require('../config/devConfig')
let {appName, exportApkFolderPath} = config
const {pack = true} = argv
const {CliUtil} = require('@ys/collection')
const {execSync} = CliUtil
const {FuncUtil} = require('@ys/vanilla')
const {timeCount} = FuncUtil

timeCount(() => {
  const localApkPath = path.resolve(__dirname, '../android/app/build/outputs/apk/app-release.apk')
  if (pack || !fs.existsSync(localApkPath)) {
    console.log('packing apk ..................')
    execSync(`
        cd android && ./gradlew assembleRelease
    `)
  }
  fse.copySync(localApkPath, path.resolve(exportApkFolderPath, `${appName}.apk`))
})
