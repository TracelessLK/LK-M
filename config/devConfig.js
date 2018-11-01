const txServerIp = '192.144.200.234'
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const devConfig = {
  appId: 'LK_M',
  appName: 'LK',
  exportIpaFolderPath: '/Users/spirit/entry/git/working_on/LK-S/static/public/ios',
  exportPPKFolderPath: '/Users/spirit/entry/git/working_on/LK-S/static/public/ppk',
  exportApkFolderPath: '/Users/spirit/entry/git/working_on/LK-S/static/public/android',
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
