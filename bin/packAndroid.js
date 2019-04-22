const fs = require('fs')
const path = require('path')
const argv = require('yargs').argv
const fse = require('fs-extra')

const {pack = true} = argv
const {CliUtil} = require('@ys/collection')

const {execSync} = CliUtil
const {FuncUtil} = require('@ys/vanilla')
const config = require('../config/devConfig')

const {appName, exportApkFolderPath} = config


const {timeCount} = FuncUtil
const {upload, timeStamp} = require('./util')

const fileName = `${appName}.apk`

timeCount(() => {
  const localApkPath = path.resolve(__dirname, '../android/app/build/outputs/apk/release/app-release.apk')
  if (pack || !fs.existsSync(localApkPath)) {
    timeStamp({packType: 'android'})
    console.log('packing apk ..................')
    execSync(`
        cd android && ./gradlew assembleRelease
    `)
  }
  const destination = path.resolve(exportApkFolderPath, fileName)
  fse.copySync(localApkPath, destination)

  return upload({
    localPath: destination,
    platform: 'android',
    isPpk: false
  })
})
