import {
  Platform,
  PushNotificationIOS,
  AsyncStorage
} from 'react-native'
// import {Toast} from 'native-base'
const {engine} = require('@lk/LK-C')
const RNFS = require('react-native-fs')

const { logPath } = require('../../lk/config')

const Application = engine.getApplication()
const lkapp = Application.getCurrentApp()
console.log(lkapp)

class PushUtil {
  constructor ({onNotfication, onInitialNotification}) {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.getInitialNotification().then(onInitialNotification)

      PushUtil.removeNotify()

      PushNotificationIOS.addEventListener('notification', onNotfication)
      PushNotificationIOS.checkPermissions((permissions) => {
        const {alert, sound, badge} = permissions

        if (alert === 0 && sound === 0 && badge === 0) {
          // Toast.show({
          //     text: '请在通知中心中允许LK发送通知',
          //     position: "top",
          //     type:"warning",
          //     duration: 10000
          // })

        } else {

        }
      })
    }
  }

  static appendToLog(option) {
    const { content, type } = option
    // console.log({option})
    const appendPath = logPath[type]
    if (__DEV__) {
      console.log({
        content, type
      })
    }
    const now = new Date()
    const str = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}: \n ${content} \n\n\n \n`
    RNFS.writeFile(appendPath, str, 'utf8').catch((err) => {
      console.log(err)
    })
  }

  static init() {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener('registrationError', (reason) => {
        PushUtil.appendToLog({
          type: 'debug',
          content: `registrationError: ${reason}`
        })
        console.log({registrationError: reason})
        throw new Error(reason)
      })
      PushNotificationIOS.addEventListener('register', (deviceId) => {
        console.log({deviceId})
        PushUtil.appendToLog({
          type: 'debug',
          content: `in register: ${deviceId}`
        })

        AsyncStorage.setItem('deviceIdAPN', deviceId)
      })
      // 必须要调用requestPermissions,否则无法接受到register事件获取deviceId
      PushNotificationIOS.requestPermissions().then(() => {
        PushNotificationIOS.addEventListener('register', (deviceId) => {
          console.log({deviceId})
          PushUtil.appendToLog({
            type: 'debug',
            content: `in register: ${deviceId}`
          })

          AsyncStorage.setItem('deviceIdAPN', deviceId)
        })
      })
      PushNotificationIOS.addEventListener('register', (deviceId) => {
        console.log({deviceId})
        PushUtil.appendToLog({
          type: 'debug',
          content: `after register: ${deviceId}`
        })

        AsyncStorage.setItem('deviceIdAPN', deviceId)
      })
    }
  }

  static setJpush () {
    if (Platform.OS === 'android') {
    }
  }

  static getAPNDeviceId () {
    // fixme: AsyncStorage 始终无法getItem
    const psAry = [AsyncStorage.getItem('deviceIdAPN'), new Promise((res) => {
      setTimeout(() => {
        res()
      }, 1000 * 2)
    })]
    return Promise.race(psAry)
  }

  static removeNotify() {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications()
      PushNotificationIOS.setApplicationIconBadgeNumber(0)
    }
  }
}

PushUtil.init()

module.exports = PushUtil
