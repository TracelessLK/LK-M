import {Toast } from 'native-base'
import {
  Image, Text, View
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import React from 'react'
import RNRestart from 'react-native-restart'
import LottieView from 'lottie-react-native'

const { engine } = require('@lk/LK-C')


const DBProxy = engine.DBProxy
const Application = engine.Application
const lkApp = Application.getCurrentApp()
const chatManager = engine.ChatManager

const { commonUtil } = require('@external/common')
const chatRight = require('../view/image/ajax-loader.gif')

const { getAvatarSource } = commonUtil
const defaultAvatar = require('../view/image/defaultAvatar.png')
const container = require('../state')
const { FuncUtil } = require('@ys/vanilla')

const { runFunc } = FuncUtil
const { PushUtil } = require('@external/common')

const { getAPNDeviceId } = PushUtil
const lkStyle = require('../view/style')
const RNFS = require('react-native-fs')
const { logPath } = require('../config')

class Util {
  /**
   * 获取IOS推送id
   * @returns {Promise} Promise resolve IOS推送id {string}
   */
  static asyGetApplePushId() {
    return getAPNDeviceId()
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
    RNFS.appendFile(appendPath, str, 'utf8').catch((err) => {
      console.log(err)
    })
  }

  static writeToLog(option) {
    const { content, type } = option
    // console.log({option})
    const appendPath = logPath[type]
    if (__DEV__) {
      // console.log({
      //   content, type
      // })
    }
    const now = new Date()
    const str = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}: \n ${content} \n\n\n \n`
    RNFS.writeFile(appendPath, str, 'utf8').catch((err) => {
      console.log(err)
    })
  }

  static getTabLogo(title, focused, iconName, iconSize = 26, badge) {
    const color = focused ? lkStyle.color.mainColor : '#a0a0a0'
    const style = { display: 'flex', justifyContent: 'center', alignItems: 'center' }
    return (
      <View style={style}>
        {badge || null}
        <Icon name={iconName} size={iconSize} color={color} />
        <Text style={{ fontSize: 10, color }}>{title}</Text>
      </View>
    )
  }

  static getAvatarSource(pic) {
    return getAvatarSource(pic, defaultAvatar)
  }

  static addExternalFriend({ navigation }) {
    navigation.navigate('ScanView', {
      onRead(e) {
        const { data } = e
        const {
          action, code, ip, port, id
        } = JSON.parse(data)
        console.log(data)
        if (code === 'LK' && action === 'addFriend') {
          lkApp.getLKWSChannel().applyMF(id, ip, port)
          Toast.show({
            text: '好友请求已成功发送!',
            position: 'top',
            type: 'success',
            duration: 3000
          })
        } else {
          Toast.show({
            text: '该二维码无效,请核对后重试!',
            position: 'top',
            type: 'warning',
            duration: 3000
          })
        }
      }
    })
  }

  static query(sql) {
    return new Promise((resolve) => {
      const db = new DBProxy()
      db.transaction(() => {
        db.getAll(sql, [], (results) => {
          resolve(results)
        }, (err) => {
          console.log(err)
        })
      })
    })
  }

  static getIconNameByState=function (state, notReadNum) {
    if (state === chatManager.MESSAGE_STATE_SENDING) {
      return 'md-arrow-round-up'
    } if (state === chatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE) {
      return 'md-refresh'
    } if (state === chatManager.MESSAGE_STATE_SERVER_RECEIVE) {
      // return 'md-checkmark-circle-outline'
      return '全部未读'
    } if (state === chatManager.MESSAGE_STATE_TARGET_RECEIVE) {
      return 'ios-checkmark-circle-outline'
    } if (state === chatManager.MESSAGE_STATE_TARGET_READ) {
      // return 'ios-mail-open-outline'
      return notReadNum ? `${notReadNum}人未读` : '全部已读'
    } if (state === 5) {
      return 'ios-bonfire-outline'
    }
    return 'ios-help'
  }

  static getIconByState(state, notReadNum) {
    // let result = <Ionicons name={Util.getIconNameByState(state)} size={20} style={{ marginRight: 5, lineHeight: 40, color: state === chatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE ? 'red' : 'black' }} />
    let result = ''
    if (state === 0) {
      result = <Image source={chatRight} style={{width: 20, height: 20, marginTop: 11, marginRight: 3}} resizeMode="contain" />
    } else {
      result = <Text style={{marginTop: 11, marginRight: 3, color: "rgb(155,155,155)"}}>{Util.getIconNameByState(state, notReadNum)}</Text>
    }
    // if (state === chatManager.MESSAGE_STATE_SENDING) {
    if (false) {
      const option = {
        autoplay: true,
        loop: true,
        source: require('../../resource/animations/loading.json'),
        style: {
          width: 200,
          height: 200,
          borderWidth: 2,
          boderColor: 'black'
        },
        autoSize: true
      }
      result = <LottieView {...option} />
    }
    return result
  }

  static dropTable(tableName) {
    let result

    if (Array.isArray(tableName)) {
      result = Promise.all(tableName.map(ele => Util.dropTable(ele)))
    } else {
      const sql = `drop table if exists ${tableName}`
      result = Util.query(sql).then(() => {
        console.log({sql})
      })
    }

    return result
  }

  static truncateTable(tableName) {
    let result

    if (Array.isArray(tableName)) {
      result = tableName.map(ele => Util.truncateTable(ele))
    } else {
      const sql = `delete from ${tableName}`
      result = Util.query(sql)
    }

    return result
  }

  // todo: should be putinto net channell
  static runNetFunc(func, { errorCb, showWarning = true } = {}) {
    // console.log({container})
    //const hasLogin = lkApp.getLogin()
    // console.log({hasLogin})
    const { connectionOK, NetInfoUtil } = container

    if (connectionOK) {
      // console.log({hasLogin})
      func()
      // if (hasLogin) {
      //   func()
      // } else {
      //   if (showWarning) {
      //     Toast.show({
      //       text: '用户身份无法确认,无法使用该功能',
      //       position: 'top',
      //       type: 'warning',
      //       duration: 5000
      //     })
      //   }
      // }
    } else {
      runFunc(errorCb)
      if (showWarning) {
        if (NetInfoUtil.online) {
          Toast.show({
            text: '无法连接服务器',
            position: 'top',
            type: 'warning'
          })
        } else {
          Toast.show({
            text: '您的连接已断开,请检查网络设置',
            position: 'top',
            type: 'warning'
          })
        }
      }
    }
  }

  static dropExtraTable() {
    console.log('dropTable')
    return Util.dropTable([
      'contact', 'device', 'group_record_state',
      'magicCode', 'mfapply', 'org', 'groupMember',
      'record', 'chat', 'flowCursor', 'db_version'
    ]).then(() => {
      console.log('restart')
      RNRestart.Restart()
    })
  }
}


Object.freeze(Util)

module.exports = Util
