const RNFS = require('react-native-fs')
const config = require('./config')
const commonUtil = require('./commonUtil')
const errorReportUtil = require('./errorReportUtil')

const devUtil = {
  appendToLog(option) {
    const {path, content} = option
    RNFS.appendFile(path, content + '\n', 'utf8').then(() => {
    }).catch((err) => {
      errorReportUtil.errorReport({
        errorStr: err.toString(),
        type: `write to ${path},content: ${content}`,
        extra: {
          stack: err.stack
        }
      })
    })
  },
  clearLog(path) {
    RNFS.writeFile(path, "", 'utf8')
      .then(() => {
      })
      .catch((err) => {
        errorReportUtil.errorReport({
          errorStr: err.toString(),
          type: `clear content of  ${path}`,
          extra: {
            stack: err.stack
          }
        })
      })
  },
  init() {
    this.test()
  },
  test() {
  },
  debugToLog(content) {
    this.appendToLog({
      path: config.devLogPath,
      content: JSON.stringify({
        content,
        time: commonUtil.getTimeDisplay()
      }, null, 5)
    })
  }

}

module.exports = devUtil
