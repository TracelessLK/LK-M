const aesjs = require('aes-js')
const config = require('../config')
const {commonUtil} = require('@external/common')
const {getAvatarSource} = commonUtil
const defaultAvatar = require('../view/image/defaultAvatar.png')
const util = {
  decryptAes (encryptData) {
    const encryptedBytes = aesjs.utils.hex.toBytes(encryptData)
    const aesCtr = new aesjs.ModeOfOperation.ctr(config.encrypt.aesKey, new aesjs.Counter(5))
    const decryptedBytes = aesCtr.decrypt(encryptedBytes)
    const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
    return decryptedText
  },
  getAvatarSource (pic) {
    return getAvatarSource(pic, defaultAvatar)
  }
}

Object.freeze(util)

module.exports = util
