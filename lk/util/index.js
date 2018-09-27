import db from '../../common/store/DataBase'
const {commonUtil} = require('@external/common')
const {getAvatarSource} = commonUtil
const defaultAvatar = require('../view/image/defaultAvatar.png')
const util = {
  getAvatarSource (pic) {
    return getAvatarSource(pic, defaultAvatar)
  },
  showAll (tableName) {
    db.transaction((tx) => {
      let sql = `select * from ${tableName}`
      tx.executeSql(sql, [], function (tx2, results) {
        let ary = []
        for (let i = 0; i < results.rows.length; i++) {
          ary.push(results.rows.item(i))
        }
        const obj = {}
        obj[tableName] = ary
        console.log(obj)
      }, function (err) {
        console.log(err)
      })
    })
  }
}

const tableAry = ['device', 'mfapply']
for (let ele of tableAry) {
  util.showAll(ele)
}

Object.freeze(util)

module.exports = util
