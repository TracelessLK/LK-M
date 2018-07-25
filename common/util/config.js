const RNFS = require('react-native-fs')

const config = {
    devLogPath:RNFS.DocumentDirectoryPath + '/devLog.txt',
    errorLogPath:RNFS.DocumentDirectoryPath + '/errorLog.txt',
}


Object.freeze(config)

module.exports = config
