const RNFS = require('react-native-fs')

const config = {
    appId:"LK_M",
    devLogPath:RNFS.DocumentDirectoryPath + '/devLog.txt',
    errorLogPath:RNFS.DocumentDirectoryPath + '/errorLog.txt',
    isDevMode:true,
    isPreviewVersion:false
}




module.exports = config
