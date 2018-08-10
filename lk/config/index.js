
const RNFS = require('react-native-fs')


const config = {
    encrypt:{
        publicKeyFormat:"pkcs8-public-der",
        privateKeyFormat:"pkcs1-der",
        signatureFormat:"hex",
        sourceFormat:"utf8",
        aesKey:[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ]
    },
    url:'http://172.18.1.181:3000/',
    appId:"LK_M",
    devLogPath:RNFS.DocumentDirectoryPath + '/devLog.txt',
    errorLogPath:RNFS.DocumentDirectoryPath + '/errorLog.txt',
    isDevMode:true,
    isPreviewVersion:false
}

Object.freeze(config)
module.exports = config
