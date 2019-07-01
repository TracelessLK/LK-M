
import React, { Component } from 'react'
import {
  AsyncStorage,
  Platform,
  YellowBox,
  Linking,
  Alert,
  Text,
  View,
  ActivityIndicator
} from 'react-native'
import Promise from 'bluebird'
import RNShake from 'react-native-shake'
import {ActionSheet} from 'native-base'
import SQLite from 'react-native-sqlite-storage'
import RSAKey from 'react-native-rsa'
import deviceInfo from 'react-native-device-info'
import RNRestart from 'react-native-restart'

import EntryView from './view/index/EntryView'
import DataSource from './store/RNSqlite'

const {engine} = require('@lk/LK-C')
const md5 = require('crypto-js/md5')
const uuid = require('uuid')
const {PushUtil} = require('@external/common')

const {getAPNDeviceId} = PushUtil

Promise.config({
  warnings: false
})

const container = require('./state')
const config = require('./config')

const { appId, appName } = config
const packageJson = require('../package.json')

const { version: versionLocal } = packageJson
const { UpdateUtil } = require('@ys/react-native-collection')

// const { appInfoUrl } = config
const ErrorUtilRN = require('ErrorUtils')
const util = require('./util')

const { writeToLog } = util

const Application = engine.Application
const ChatManager = engine.ChatManager
const lkApplication = Application.getCurrentApp()

lkApplication.on('currentUserChanged', (user) => {
  if (user) {
    checkUpdate(user)
    container.state.user = user
    AsyncStorage.setItem('user', JSON.stringify(user))
  } else {
    AsyncStorage.removeItem('user')
    container.state = {}
  }
})

lkApplication.on('netStateChanged', ({param}) => {
  container.connectionOK = param.isConnected
})

async function checkUpdate(param) {
  if (container.NetInfoUtil.online) {
    const {
      serverIP, id, name, updateAnyWay = false
    } = param
    const appInfo = {
      updateUrl: "/api/update/checkUpdate",
      httpProtocol: "http",
      port: "3000"
    }
    const { updateUrl, httpProtocol, port } = appInfo
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
      },
      updateAnyWay
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

const { ErrorUtil, ErrorStock } = require('@ys/react-native-collection')

const { setGlobalErrorHandler } = ErrorUtil
const f = (error) => {
  console.log({ stack: error.stack })

  writeToLog({
    type: 'now',
    content: `${error.toString()}\n${error.stack}`
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

global.onunhandledrejection = (error) => {
  if (error instanceof Error) {
    writeToLog({
      type: 'now',
      content: `${error.toString()}\n${error.stack}`
    })
    errorStock.processError({ error })
  }
}

export default class LKEntry extends Component<{}> {
  shakeCount = 0

  state = {
    stage: 0, // 0: 等待, 1: 升级, 2:正常进入主界面,
    info: '正在升级中, 请稍候...'
  }

  async componentDidMount() {
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log(`Initial URL: ${url}`)
      }
    }).catch(err => console.error('An error occurred', err))
    Linking.addEventListener('url', () => {
      // const {url} = event
    })


    // 先检测是否已注册新的账号
    await lkApplication.start(DataSource, Application.PLATFORM_RN)

    const UserManager = engine.UserManager
    const userAry = await UserManager.asyGetAll()
    const {length} = userAry
    if (!length) {
      const database = SQLite.openDatabase({name: 'traceless.db', location: 'default'}, async () => {
        // 检测是否是traceless 升级到LK
        const tableAry = await ChatManager.getAllTableAry()
        if (tableAry.includes('traceless')) {
          Alert.alert(
            '升级需知',
            '升级中请保持网络连接,在升级完成之前请勿关闭应用程序!',
            [
              {
                text: '确认',
                onPress: () => {
                  this.updateTraceless(database)
                }
              }
            ]
          )
        } else {
          this.setState({
            stage: 2
          })
        }
      }, (err) => {
        console.log(err)
        this.setState({
          stage: 2
        })
      })
    } else {
      this.setState({
        stage: 2
      })
    }
  }

  updateTraceless(db) {
    const passwordRawStr = 'admin'
    this.setState({
      info: '正在生成新的密钥...',
      stage: 1
    })

    db.transaction((tx) => {
      tx.executeSql('select * from traceless', [], async (result) => {
        const bits = 1024
        const exponent = '10001'

        const rsa = new RSAKey()
        rsa.generate(bits, exponent)
        const publicKey = rsa.getPublicString() // return json encoded string
        const privateKey = rsa.getPrivateString() // return js

        this.setState({info: '已生成新的密钥...'})
        const password = md5(passwordRawStr).toString()
        const obj = JSON.parse(result.rows.item(0).data)[0]

        this.setState({info: '激活账户信息...'})

        const user = {
          id: obj.id,
          name: obj.name,
          publicKey,
          privateKey,
          deviceId: uuid(),
          serverIP: '62.234.46.12',
          serverPort: '3001',
          password
        }

        const description = JSON.stringify({
          brand: deviceInfo.getBrand(),
          device: deviceInfo.getDeviceId()
        })
        const venderDid = await getAPNDeviceId()

        // const option = {
        //   user,
        //   venderDid,
        //   description
        // }
        await lkApplication.updateRegister({
          user,
          venderDid,
          description
        })
        this.setState({info: '升级激活成功,即将重启!'})
        setTimeout(() => {
          RNRestart.Restart()
        }, 1000 * 1.5)
      }, (err) => {
        console.log(err)
        this.setState({
          stage: 2
        })
      })
    })
  }

  componentWillMount() {
    RNShake.addEventListener('ShakeEvent', () => {
      this.shakeCount++
      console.log(this.shakeCount)
      if (this.shakeCount > 5) {
        const BUTTONS = ['热更新',
          // '添加外部好友',
          '取消']
        const CANCEL_INDEX = BUTTONS.length - 1

        ActionSheet.show(
          {
            options: BUTTONS,
            cancelButtonIndex: CANCEL_INDEX,
            title: ''
          },
          (buttonIndex) => {
            if (buttonIndex === 0) {

            } else if (buttonIndex === 1) {
              checkUpdate({
                updateAnyWay: true,
                serverIP: '172.18.1.181'
              })
            }
          }
        )
      }
      setTimeout(() => {
        this.shakeCount = 0
      }, 1000 * 10)
    })
  }

  componentWillUnmount() {
    RNShake.removeEventListener('ShakeEvent')
  }

  render() {
    const schemeName = 'lkapp'
    const prefix = Platform.OS === 'android' ? `${schemeName}://${schemeName}/` : `${schemeName}://`
    let content
    if (this.state.stage === 0) {
      content = null
    } else if (this.state.stage === 1) {
      content = (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          {/* <View> */}
          {/*  <Image source={require('./view/image/1024x1024.png')} resizeMode="contain" style={{width: '50%'}} /> */}
          {/* </View> */}
          <ActivityIndicator size="large" />
          <View style={{marginVertical: 10}}>
            <Text>
              {this.state.info}
            </Text>
          </View>
        </View>
      )
    } else if (this.state.stage = 2) {
      content = <EntryView uriPrefix={prefix} />
    }

    return content
  }
}
