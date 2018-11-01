import {
  Platform,
  PushNotificationIOS,
  Alert,
  AsyncStorage
} from 'react-native'
// import {Toast} from 'native-base'

if (Platform.OS === 'ios') {
  PushNotificationIOS.requestPermissions().then(res => {
    PushNotificationIOS.addEventListener('registrationError', (reason) => {
      throw new Error(reason)
    })
    PushNotificationIOS.addEventListener('register', (deviceId) => {
      if (__DEV__ && Platform.OS === 'ios') {
        // console.log(`deviceId APN: ${deviceId}`)
      }
      AsyncStorage.setItem('deviceIdAPN', deviceId)
    })
  })
}
const pushUtil = {
  setJpush (option) {
    if (Platform.OS === 'android') {
    }
  },
  init () {
    if (Platform.OS === 'ios') {
      // 必须要调用requestPermissions,否则无法接受到register事件获取deviceId

      PushNotificationIOS.getInitialNotification().then(res => {
        // TODO 跳转到指定聊天窗口
      })

      this.removeNotify()

      // PushNotificationIOS.addEventListener('notification', (res) => {
      //
      // });
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
  },
  getAPNDeviceId () {
    return AsyncStorage.getItem('deviceIdAPN')
  },
  removeNotify () {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications()
      PushNotificationIOS.setApplicationIconBadgeNumber(0)
    }
  }
}

pushUtil.init()

module.exports = pushUtil
