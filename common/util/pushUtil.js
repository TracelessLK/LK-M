import {Platform, PushNotificationIOS} from "react-native";
import {Toast} from 'native-base'
let deviceIdApn,deviceIdApnPromise


const pushUtil = {
    deviceIdApn:null,
    setJpush(option){
        if(Platform.OS === 'android'){
        }
    },
    init(){
        if(Platform.OS === 'ios'){
            //必须要调用requestPermissions,否则无法接受到register事件获取deviceId
            PushNotificationIOS.requestPermissions().then(res=>{

            })
            deviceIdApnPromise = this.iosPushInit()

            PushNotificationIOS.getInitialNotification().then(res=>{
                //TODO 跳转到指定聊天窗口
            })

            this.removeNotify()

            // PushNotificationIOS.addEventListener('notification', (res) => {
            //
            // });
            PushNotificationIOS.checkPermissions((permissions) => {
                const {alert,sound,badge} = permissions

                if(alert === 0 && sound === 0 && badge === 0){
                    Toast.show({
                        text: '请在通知中心中允许LK发送通知',
                        position: "top",
                        type:"warning",
                        duration: 10000
                    })

                }else{

                }
            });
            PushNotificationIOS.addEventListener('registrationError', (reason) => {

            });
        }
    },
    getAPNDeviceId(){
        let result;
        if(Platform.OS === 'ios'){
            if(deviceIdApn){
                result = Promise.resolve(deviceIdApn)
            }else{
                result = deviceIdApnPromise
            }
        }else{
            result = Promise.resolve(null)
        }

        return result
    },
    iosPushInit(){
        return new Promise(resolve=>{
            PushNotificationIOS.addEventListener('register', (deviceId) => {
                if(__DEV__ && Platform.OS === 'ios'){
                    // console.log(`deviceId APN: ${deviceId}`)

                }

                deviceIdApn = deviceId
                this.deviceIdApn = deviceIdApn

                resolve(deviceId)
            });

        })
    },
    removeNotify(){
        if(Platform.OS === 'ios'){
            PushNotificationIOS.removeAllDeliveredNotifications();
            PushNotificationIOS.setApplicationIconBadgeNumber(0)
        }
    },
}

module.exports = pushUtil
