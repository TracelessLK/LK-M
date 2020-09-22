const commonUtil = require('./commonUtil')

const util = {
  getDisplayTime (date) {
    let result = ''
    const now = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const hour = date.getHours()
    let minute = date.getMinutes()
    const dayDiff = Math.floor(now.getTime() / (1000 * 60 * 60 * 24)) - Math.floor(date.getTime() / (1000 * 60 * 60 * 24))

    if (year === now.getFullYear()) {
      if (month === now.getMonth() && day === now.getDate()) {
        let prefix = ''
        if (hour < 12) {
          prefix = '上午'
        } else if (hour > 12) {
          prefix = '下午'
        } else if (hour === 12) {
          prefix = '中午'
        }
        if (minute < 10) {
          minute = '0' + minute
        }
        result = `${prefix} ${hour}:` + minute
      } else {
        result = `${commonUtil.pad(month + 1)}-${commonUtil.pad(day)}`
      }
    } else {
      result = `${year}年-${commonUtil.pad(month + 1)}月-${commonUtil.pad(day)}日`
    }
    if (dayDiff === 1) {
      result = '昨天'
    }
    return result
  }
}

Object.freeze(util)

module.exports = util
