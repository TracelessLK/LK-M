import db from '../../common/store/DataBase'
import {Toast} from 'native-base'
import {Text, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
const {commonUtil} = require('@external/common')
const lkApp = require('../LKApplication').getCurrentApp()
const {getAvatarSource} = commonUtil
const defaultAvatar = require('../view/image/defaultAvatar.png')
const container = require('../state')
const {FuncUtil} = require('@ys/vanilla')
const {runFunc} = FuncUtil
const chatManager = require('../core/ChatManager')
const {pushUtil} = require('@external/common')
const lkStyle = require('../view/style')

class Util {
  /**
   * 获取IOS推送id
   * @returns {Promise} Promise resolve IOS推送id {string}
   */
  static asyGetApplePushId () {
    return pushUtil.getAPNDeviceId()
  }
  static getTabLogo (title, focused, iconName, iconSize = 26, badge) {
    let color = focused ? lkStyle.color.mainColor : '#a0a0a0'
    let style = {display: 'flex', justifyContent: 'center', alignItems: 'center'}
    return (
      <View style={style}>
        {badge || null}
        <Icon name={iconName} size={iconSize} color={color}/>
        <Text style={{fontSize: 10, color}}>{title}</Text>
      </View>
    )
  }
  static getAvatarSource (pic) {
    return getAvatarSource(pic, defaultAvatar)
  }
  static addExternalFriend ({navigation}) {
    navigation.navigate('ScanView', {
      onRead (e) {
        const {data} = e
        const {action, code, ip, port, id} = JSON.parse(data)
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
  static async showAll (tableName) {
    let sql = `select * from ${tableName}`
    const ary = await Util.query(sql)

    const obj = {}
    obj[tableName] = ary
    console.log(obj)
  }
  static query (sql) {
    return new Promise(resolve => {
      db.transaction((tx) => {
        tx.executeSql(sql, [], function (tx2, results) {
          let ary = []
          for (let i = 0; i < results.rows.length; i++) {
            ary.push(results.rows.item(i))
          }
          resolve(ary)
        }, function (err) {
          console.log(err)
        })
      })
    })
  }
  static removeAllGroup () {
    return Util.deleteTable([''])
  }
  static getIconNameByState=function (state) {
    if (state === chatManager.MESSAGE_STATE_SENDING) {
      return 'md-arrow-round-up'
    } else if (state === chatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE) {
      return 'md-refresh'
    } else if (state === chatManager.MESSAGE_STATE_SERVER_RECEIVE) {
      return 'md-checkmark-circle-outline'
    } else if (state === chatManager.MESSAGE_STATE_TARGET_RECEIVE) {
      return 'ios-checkmark-circle-outline'
    } else if (state === chatManager.MESSAGE_STATE_TARGET_READ) {
      return 'ios-mail-open-outline'
    } else if (state === 5) {
      return 'ios-bonfire-outline'
    }
    return 'ios-help'
  }
  static deleteTable (tableName) {
    if (Array.isArray(tableName)) {
      const promiseAry = []
      for (let ele of tableName) {
        promiseAry.push(Util._deleteTable(ele))
      }
      return Promise.all(promiseAry)
    } else {
      return Util._deleteTable(tableName)
    }
  }
  static _deleteTable (tableName) {
    const sql = `delete from ${tableName}`
    return Util.query(sql)
  }
  static dropTable (tableName) {
    const sql = `drop table ${tableName}`
    return Util.query(sql)
  }
  // todo: should be putinto net channell
  static runNetFunc (func, {errorCb, showWarning = true} = {}) {
    // console.log({container})
    const hasLogin = lkApp.getLogin()
    // console.log({hasLogin})

    if (hasLogin) {
      const {connectionOK, NetInfoUtil} = container
      if (connectionOK) {
        func()
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
    } else {
      Toast.show({
        text: '您的账户已在服务端被删除,无法再与服务端通信',
        position: 'top',
        type: 'warning',
        duration: 5000
      })
    }
  }
}

const tableAry = [
  // 'device', 'mfapply', 'contact', 'record',
  // 'chat', 'groupMember'
  'record'
]

;(async () => {
  // Util.dropTable('group_record_state')
  // const friendAry = await Util.query('select * from contact where relation=1')
  // console.log({friendAry})
  // await Util.removeAllGroup()
  for (let ele of tableAry) {
    Util.showAll(ele)
  }
})()

Object.freeze(Util)

module.exports = Util
