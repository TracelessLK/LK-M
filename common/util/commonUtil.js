const _ = require('lodash')

const commonUtil = {
  getTimeDisplay () {
    const date = new Date()
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  },
  runFunc (func) {
    if (func) {
      func()
    }
  },
  debounceFunc (func, interval = 1000 * 2) {
    return _.throttle(func, interval, {
      leading: true,
      trailing: false
    })
  },
  getFolderId (filePath) {
    return filePath.split('/')[6]
  },
  getAvatarSource (pic, defaultPic) {
    let result
    if (pic) {
      result = {uri: pic}
    } else {
      result = defaultPic
    }
    return result
  },
  pad (num) {
    num = String(num)
    if (num.length === 1) {
      num = '0' + num
    }
    return num
  }

}
Object.freeze(commonUtil)

module.exports = commonUtil
