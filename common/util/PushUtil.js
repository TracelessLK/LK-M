import {
  Platform,
  PushNotificationIOS,
  Alert,
  AsyncStorage
} from 'react-native'
// import {Toast} from 'native-base'

if (Platform.OS === 'ios') {
  PushNotificationIOS.requestPermissions().then(() => {
    PushNotificationIOS.addEventListener('registrationError', (reason) => {
      throw new Error(reason)
    })
    PushNotificationIOS.addEventListener('register', (deviceId) => {
      if (__DEV__ && Platform.OS === 'ios') {
        // console.log(`deviceId APN: ${deviceId}`)
      }
      // Alert.alert(deviceId + '')
      AsyncStorage.setItem('deviceIdAPN', deviceId)
    })
  })
}
class PushUtil {
  constructor ({onNotfication, onInitialNotification}) {
    if (Platform.OS === 'ios') {
      // 必须要调用requestPermissions,否则无法接受到register事件获取deviceId

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
