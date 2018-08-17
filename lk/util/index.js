const aesjs = require('aes-js')
const config = require('../config')
const {commonUtil} = require("@hfs/common")
const {getAvatarSource} = commonUtil

const util = {
    decryptAes(encryptData){
        const encryptedBytes = aesjs.utils.hex.toBytes(encryptData);
        const aesCtr = new aesjs.ModeOfOperation.ctr(config.encrypt.aesKey, new aesjs.Counter(5));
        const decryptedBytes = aesCtr.decrypt(encryptedBytes);

        const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        return decryptedText
    },
    getAvatarSource(pic){
        return getAvatarSource(pic,require('../view/image/defaultAvatar.png'))
    },
}

Object.freeze(util)

module.exports = util
