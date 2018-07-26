import {Platform, PushNotificationIOS, StyleSheet,Alert} from 'react-native'
import {Toast} from "native-base";
const _ = require('lodash')
let deviceIdApn,deviceIdApnPromise
import DeviceInfo from 'react-native-device-info'



let AppUtil={
    setApp (app) {
        this.app = app;
    },
    reset (target) {
        this._target = target;
        this.app.reset();
    },
    getResetTarget () {
        return this._target;
    },
    clearResetTarget () {
        delete this._target;
    },
    isFreeRegister () {
        return true;
    },

    getAvatarSource(pic){
        let result
        if(pic){
            result = {uri:pic}
        }else{
            result = require('./image/defaultAvatar.png')
        }
        return result
    },
    init(){

    },


};
module.exports =  AppUtil;
