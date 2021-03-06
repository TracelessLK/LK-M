const txServerIp = '192.144.200.234'
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const devConfig = {
  LK_S_path: '',
  appId: 'LK_M',
  appName: 'LK',
  ip: txServerIp,
  sshInfo: {
    username: 'root',
    password: ''
  },
  serverRoot: '/opt/testing/LK-S',
  serverHostAry: ['62.234.46.12', '192.144.200.234']
}

const unversionedPath = path.resolve(__dirname, 'unversioned.js')
if (fs.existsSync(unversionedPath)) {
  _.merge(devConfig, require(unversionedPath))
}

devConfig.exportIpaFolderPath = path.resolve(devConfig.LK_S_path, 'static/public/ios')
devConfig.exportPPKFolderPath = path.resolve(devConfig.LK_S_path, 'static/public/ppk')
devConfig.exportApkFolderPath = path.resolve(devConfig.LK_S_path, 'static/public/android')

Object.freeze(devConfig)
module.exports = devConfig
