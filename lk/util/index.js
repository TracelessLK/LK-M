const aesjs = require('aes-js')
const config = require('../config')


const util = {
    decryptAes(encryptData){
        const encryptedBytes = aesjs.utils.hex.toBytes(encryptData);
        const aesCtr = new aesjs.ModeOfOperation.ctr(config.encrypt.aesKey, new aesjs.Counter(5));
        const decryptedBytes = aesCtr.decrypt(encryptedBytes);

        const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        return decryptedText
    },
    getAvatarSource(pic){
        let result
        if(pic){
            result = {uri:pic}
        }else{
            result = require('../image/defaultAvatar.png')
        }
        return result
    },
}

Object.freeze(util)

module.exports = util
