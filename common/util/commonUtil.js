import {
  Platform
} from 'react-native'

const _ = require('lodash')

const commonUtil = {
  runFunc (func) {
    if (func) {
      func()
    }
  },
  getTimeDisplay () {
    const date = new Date()
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  },
  debounceFunc (func, interval = 1000 * 2) {
    return _.throttle(func, interval, {
      leading: true,
      trailing: false
    })
  },
  getFolderId (filePath) {
    let result = null
    if (Platform.OS === 'ios') {
      try {
        if (filePath.includes('/Application/')) {
          result = filePath.split('/Application/')[1].split('/')[0]
        }
      } catch (error) {
        console.log({error})
      }
    }
    return result
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
