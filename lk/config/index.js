
const RNFS = require('react-native-fs')

const config = {
  appId: 'LK_M',
  devLogPath: RNFS.DocumentDirectoryPath + '/devLog.txt',
  errorLogPath: RNFS.DocumentDirectoryPath + '/errorLog.txt',
  isDevMode: true,
  isPreviewVersion: false,
  isEncrypted: true
}

// config in production
config.isEncrypted = true

Object.freeze(config)
module.exports = config
