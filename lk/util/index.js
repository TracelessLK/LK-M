import db from '../../common/store/DataBase'
import {Toast} from 'native-base'
const {commonUtil} = require('@external/common')
const lkApp = require('../LKApplication').getCurrentApp()
const {getAvatarSource} = commonUtil
const defaultAvatar = require('../view/image/defaultAvatar.png')
const util = {
  getAvatarSource (pic) {
    return getAvatarSource(pic, defaultAvatar)
  },
  addExternalFriend ({navigation}) {
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
  },
  async showAll (tableName) {
    let sql = `select * from ${tableName}`
    const ary = await this.query(sql)

    const obj = {}
    obj[tableName] = ary
    console.log(obj)
  },
  query (sql) {
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
  },
  removeAllGroup () {
    return this.deleteTable([''])
  },
  deleteTable (tableName) {
    if (Array.isArray(tableName)) {
      const promiseAry = []
      for (let ele of tableName) {
        promiseAry.push(this._deleteTable(ele))
      }
      return Promise.all(promiseAry)
    } else {
      return this._deleteTable(tableName)
    }
  },
  _deleteTable (tableName) {
    const sql = `delete from ${tableName}`
    return this.query(sql)
  }
}

const tableAry = [
  // 'device', 'mfapply', 'contact', 'record',
  // 'chat', 'groupMember'
  'record'
]

;(async () => {
  // const friendAry = await util.query('select * from contact where relation=1')
  // console.log({friendAry})
  // await util.removeAllGroup()
  for (let ele of tableAry) {
    util.showAll(ele)
  }
})()

Object.freeze(util)

module.exports = util
