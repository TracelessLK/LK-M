
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
    error: RNFS.DocumentDirectoryPath + '/error.txt',
    debug: RNFS.DocumentDirectoryPath + '/debug.txt',
    info: RNFS.DocumentDirectoryPath + '/info.txt',
    now: RNFS.DocumentDirectoryPath + '/now.txt'
  },
  maxChatDisplay: 100
}

// config in production
config.isEncrypted = true

Object.freeze(config)
module.exports = config
