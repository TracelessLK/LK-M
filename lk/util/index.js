const {commonUtil} = require('@external/common')
const {getAvatarSource} = commonUtil
const defaultAvatar = require('../view/image/defaultAvatar.png')
const util = {
  getAvatarSource (pic) {
    return getAvatarSource(pic, defaultAvatar)
  }
}

Object.freeze(util)

module.exports = util
