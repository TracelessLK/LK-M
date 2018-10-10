const commonUtil = require('./commonUtil')

const util = {
  getDisplayTime (date) {
    let result = ''
    const now = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
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
        result = `${prefix} ${hour}:` + minute.toString().padStart(2, 0)
      } else {
        result = `${commonUtil.pad(month + 1)}-${day}`
      }
    } else {
      result = `${year}-${commonUtil.pad(month + 1)}月-${day}日`
    }
    if (dayDiff === 1) {
      result = '昨天'
    }
    return result
  }
}

Object.freeze(util)

module.exports = util
