import {
  NetInfo
} from 'react-native'
import {Toast} from 'native-base'
const errorReportUtil = require('./errorReportUtil')
const commonUtil = require('./commonUtil')

const netInfoUtil = {
  init () {
    NetInfo.addEventListener('connectionChange', (connectionInfo) => {
      const {type} = connectionInfo
      if (type === 'none' || type === 'unknown') {
        this.online = false
      } else {
        this.online = true
      }
    }
    )
  },
  online: true,
  webConnet (func, offlineCb) {
    if (this.online) {
      func()
    } else {
      commonUtil.runFunc(offlineCb)
      this.informNoConnection()
    }
  },
  informNoConnection: commonUtil.debounceFunc(() => {
    Toast.show({
      text: '无法连接网络,请检查网络设置',
      position: 'top',
      type: 'warning',
      duration: 5000
    })
  }, 1000 * 60),
  httpPost (option) {
    const {offlineCb, url, param} = option

    return new Promise(resolve => {
      this.webConnet(() => {
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(param)
        }).then(response => {
          let result = response.json()
          resolve(result)
        }).catch(error => {
          errorReportUtil.errorReportForError({
            error,
            type: 'httpPost',
            extra: {
              url,
              param
            }
          })
        })
      }, offlineCb)
    })
  }
}

module.exports = netInfoUtil
