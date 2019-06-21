import React from 'react'
import {
  Text, View, ScrollView,
  AsyncStorage
} from 'react-native'
import {Card} from 'react-native-elements'
import DeviceInfo from 'react-native-device-info'
import {isFirstTime} from 'react-native-update'
import ScreenWrapper from '../../common/ScreenWrapper'

const LKC = require('@lk/LK-C')

const {engine} = LKC

const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()
const packageJSON = require('../../../../package')

const {version} = packageJSON


export default class InfoView extends ScreenWrapper {
  constructor(props) {
    super(props)
    this.user = lkApp.getCurrentUser()
    this.state = {
      deviceIdAPN: ''
    }
  }

  async componentDidMount() {
    const deviceIdAPN = await AsyncStorage.getItem('deviceIdAPN')
    let appJSON = {

    }
    try {
      // appJSON = require('../../../app.json')
    } catch (err) {
      // fs.writeFileSync('../../../app.json', JSON.stringify({}), 'utf8')
      // appJSON = fs.readFileSync('../../../app.json', 'utf-8')
    }
    const {packType = '', packTime = ''} = appJSON
    this.setState({
      deviceIdAPN, packType, packTime
    })
  }

  subRender() {
    const ary = [
      `serverIP: ${this.user.serverIP}`,
      `serverPort: ${this.user.serverPort}`,
      `uid:  ${this.user.id}`,
      `clientId:  ${this.user.deviceId}`,
      `bundleId:  ${DeviceInfo.getBundleId()}`,
      `isFirstTime: ${isFirstTime ? '是' : '否'}`,
      `engineVersion: ${require('@lk/LK-C/package').version}`,
      `__DEV__:  ${__DEV__ ? '是' : '否'}`,
      `uniqueId:  ${DeviceInfo.getUniqueID()}`,
      `原生版本:  ${DeviceInfo.getVersion()}`,
      `版本号: ${version}`,
      `buildNumber: ${DeviceInfo.getBuildNumber()}`,
      `apnId:  ${this.state.deviceIdAPN}`,
      `packType: ${this.state.packType}`,
      `packTime: ${this.state.packTime}`,
      `品牌: ${DeviceInfo.getBrand()}`,
      `appName: ${DeviceInfo.getApplicationName()}`,
      `locale: ${DeviceInfo.getDeviceLocale()}`,
      `os: ${DeviceInfo.getSystemName()}`,
      `os version: ${DeviceInfo.getSystemVersion()}`,
      `version: ${DeviceInfo.getVersion()}`,
      `是否模拟器: ${DeviceInfo.isEmulator()}`,
      `是否平板: ${DeviceInfo.isTablet()}`

    ]

    const aryView = ary.map((ele, index) => (
      <View
        style={{
          marginHorizontal: 5, marginTop: 20, justifyContent: 'flex-start', alignItems: 'flex-start'
        }}
        key={index}
      >
        <Text selectable style={{}}>
          {ele}
        </Text>
      </View>
    ))
    return (
      <ScrollView>
        <View style={{
          display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: 40
        }}
        >
          <Card title="" style={{}}>
            {aryView}
          </Card>
        </View>
      </ScrollView>
    )
  }
}
