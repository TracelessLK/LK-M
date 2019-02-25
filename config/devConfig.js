const txServerIp = '192.144.200.234'
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const LK_S_path = '/Volumes/Samsung_T5/entry/code/working_on/work/LK_S'

const devConfig = {
  appId: 'LK_M',
  appName: 'LK',
  exportIpaFolderPath: path.resolve(LK_S_path, 'static/public/ios'),
  exportPPKFolderPath: path.resolve(LK_S_path, 'static/public/ppk'),
  exportApkFolderPath: path.resolve(LK_S_path, 'static/public/android'),
  ip: txServerIp,
  sshInfo: {
    username: 'root'
  },
  serverRoot: '/opt/testing/LK-S'
}

const unversionedPath = path.resolve(__dirname, 'unversioned.js')
if (fs.existsSync(unversionedPath)) {
  _.merge(devConfig, require(unversionedPath))
}

Object.freeze(devConfig)
module.exports = devConfig
