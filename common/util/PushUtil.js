import {
  Platform,
  PushNotificationIOS,
  Alert,
  AsyncStorage
} from 'react-native'
// import {Toast} from 'native-base'
const {engine} = require('@lk/LK-C')

const Application = engine.getApplication()
const lkapp = Application.getCurrentApp()

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

      if (Platform.OS === 'ios') {
        // 必须要调用requestPermissions,否则无法接受到register事件获取deviceId

        PushNotificationIOS.requestPermissions().then(() => {
          PushNotificationIOS.addEventListener('register', (deviceId) => {
            // console.log({deviceId})
            const user = lkapp.getCurrentUser()

            AsyncStorage.setItem('deviceIdAPN', deviceId)
          })
          PushNotificationIOS.addEventListener('registrationError', (reason) => {
            console.log({registrationError: reason})
            throw new Error(reason)
          })
        })
      }
    }
  }

  static setJpush (option) {
    if (Platform.OS === 'android') {
    }
  }
  static getAPNDeviceId () {
    return AsyncStorage.getItem('deviceIdAPN')
  }
  static removeNotify () {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications()
      PushNotificationIOS.setApplicationIconBadgeNumber(0)
    }
  }
}

module.exports = PushUtil
