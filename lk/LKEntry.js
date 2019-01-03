
import React, { Component } from 'react'
import {
  AsyncStorage,
  Platform,
  YellowBox,
  Linking,
  Alert
} from 'react-native'
import EntryView from './view/index/EntryView'
import Promise from 'bluebird'
import {isFirstTime} from 'react-native-update'

const container = require('./state')
const config = require('./config')
const {appId, appName} = config
const packageJson = require('../package.json')
const {version: versionLocal} = packageJson
const {UpdateUtil} = require('@ys/react-native-collection')
const {appInfoUrl} = config
const ErrorUtilRN = require('ErrorUtils')
const util = require('./util')
const {writeToLog} = util
const {engine} = require('@lk/LK-C')

const Application = engine.getApplication()
const lkApplication = Application.getCurrentApp()

console.log({isFirstTime})

lkApplication.on('currentUserChanged', user => {
  if (user) {
    // console.log({user})
    checkUpdate(user)
    container.state.user = user
    AsyncStorage.setItem('user', JSON.stringify(user))
  } else {
    AsyncStorage.removeItem('user')
    container.state = {}
  }
})

lkApplication.on('netStateChanged', (result) => {
  container.connectionOK = result
})

async function checkUpdate (user) {
  if (container.NetInfoUtil.online) {
    const {serverIP, id, name} = user
    const response = await fetch(appInfoUrl)
    const appInfo = await response.json()
    const {updateUrl, httpProtocol, port} = appInfo
    let base = `${httpProtocol}://${serverIP}:${port}`
    const updateUrlBase = await AsyncStorage.getItem('updateUrlBase')
    if (updateUrlBase) {
      base = updateUrlBase
    }

    // console.log({appInfo})
    const checkUpdateUrl = `${base}${updateUrl}`
    // console.log({checkUpdateUrl})
    const manualDownloadUrl = `${base}/pkg/${Platform.OS}/${appName}.${Platform.OS === 'android' ? 'apk' : 'ipa'}`

    const option = {
      checkUpdateUrl,
      versionLocal,
      manualDownloadUrl,
      appId
    }
    const updateUtil = new UpdateUtil(option)
    container.updateUtil = updateUtil
    const optionCheck = {
      customInfo: {
        id,
        name
      },
      versionLocal,
      checkUpdateErrorCb: (error) => {
        console.log(error)
      }
    }
    updateUtil.checkUpdate(optionCheck)
  }
}

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated in plain JavaScript React classes. Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks.',
  'Module RCTHotUpdate requires',
  'Method `jumpToIndex` is deprecated',
  'Module RNFetchBlob',
  'Failed prop type: Invalid props.style key `NativeBase` supplied to `View`.',
  'a promise was rejected with a non-error',
  'a promise was created in'
])
console.disableYellowBox = true
// console.log(process.env)

const {ErrorUtil, ErrorStock} = require('@ys/react-native-collection')
const {setGlobalErrorHandler} = ErrorUtil
const f = (error) => {
  console.log({stack: error.stack})

  writeToLog({
    type: 'now',
    content: error.toString() + '\n' + error.stack
  })
  const user = lkApplication.getCurrentUser()
  const ary = ['zcy', 'dds', 'rbg', 'goofy']
  if (user && ary.includes(user.name)) {
    Alert.alert(error.toString())
  }
}
const resetTime = 1000
const option = {
  // todo error upload
  productionProcess: f,
  devProcess: f,
  ErrorUtilRN,
  resetTime
}
setGlobalErrorHandler(option)
global.Promise = Promise

const errorStock = new ErrorStock(resetTime)
// console.log(global)

global.onunhandledrejection = (error) => {
  console.log({error})
  if (error instanceof Error) {
    writeToLog({
      type: 'now',
      content: error.toString() + '\n' + error.stack
    })
    errorStock.processError({error})
  }
}
// console.log(global)

export default class LKEntry extends Component<{}> {
  componentDidMount () {
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial URL: ' + url)
      }
    }).catch(err => console.error('An error occurred', err))
    Linking.addEventListener('url', event => {
      // const {url} = event
    })
  }
  render () {
    const schemeName = 'lkapp'
    const prefix = Platform.OS === 'android' ? `${schemeName}://${schemeName}/` : `${schemeName}://`

    return (
      <EntryView uriPrefix={prefix}></EntryView>
    )
  }
}
