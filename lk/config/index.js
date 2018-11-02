
const RNFS = require('react-native-fs')

const config = {
  appId: 'LK_M',
  devLogPath: RNFS.DocumentDirectoryPath + '/devLog.txt',
  errorLogPath: RNFS.DocumentDirectoryPath + '/errorLog.txt',
  isDevMode: true,
  isPreviewVersion: false,
  isEncrypted: true,
  appName: 'LK',
  appInfoUrl: 'https://raw.githubusercontent.com/tracelessman/LK-M/dev_z/public/app.json',
  logPath: {
    error: RNFS.DocumentDirectoryPath + '/log/error.txt',
    debug: RNFS.DocumentDirectoryPath + '/log/debug.txt',
    info: RNFS.DocumentDirectoryPath + '/log/info.txt'
  }
}

// config in production
config.isEncrypted = true

Object.freeze(config)
module.exports = config
