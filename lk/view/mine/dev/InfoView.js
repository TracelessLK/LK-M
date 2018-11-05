import React, { Component} from 'react'
import {
  Text, View, ScrollView,
  AsyncStorage
} from 'react-native'
import {Card} from 'react-native-elements'
import DeviceInfo from 'react-native-device-info'
const lkApp = require('../../../LKApplication').getCurrentApp()
const appJSON = require('../../../app.json')
const {packType, packTime} = appJSON

export default class InfoView extends Component<{}> {
  constructor (props) {
    super(props)
    this.user = lkApp.getCurrentUser()
    this.state = {
      deviceIdAPN: ''
    }
  }

  async componentDidMount () {
    const deviceIdAPN = await AsyncStorage.getItem('deviceIdAPN')
    this.setState({
      deviceIdAPN
    })
  }

  render () {
    const ary = [
      `uid:  ${this.user.id}`, `clientId:  ${this.user.deviceId}`, `bundleId:  ${DeviceInfo.getBundleId()}`,
      `__DEV__:  ${__DEV__ ? '是' : '否'}`, `uniqueId:  ${DeviceInfo.getUniqueID()}`,
      `原生版本:  ${DeviceInfo.getVersion()}`, `buildNumber: ${DeviceInfo.getBuildNumber()}`,
      `apnId:  ${this.state.deviceIdAPN}`, `packType: ${packType}`, `packTime: ${packTime}`
    ]

    const aryView = ary.map((ele, index) => {
      return (
        <View style={{marginHorizontal: 5, marginTop: 20, justifyContent: 'flex-start', alignItems: 'flex-start'}} key={index}>
          <Text selectable style={{}} >
            {ele}
          </Text>
        </View>
      )
    })
    return (
      <ScrollView>
        <View style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: 40}}>
          <Card title="" style={{}}>
            {aryView}
          </Card>
        </View>
      </ScrollView>
    )
  }
}
