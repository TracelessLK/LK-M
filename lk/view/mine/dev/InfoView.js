import React, { Component} from 'react'
import {
  Text, View, ScrollView,
  AsyncStorage
} from 'react-native'
import {Card} from 'react-native-elements'
import DeviceInfo from 'react-native-device-info'
const lkApp = require('../../../LKApplication').getCurrentApp()

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
    return (
      <ScrollView>
        <View style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: 40}}>
          <Card title="" style={{}}>
            <View style={{marginHorizontal: 5, marginTop: 20, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text selectable style={{}} >
                uid:{this.user.id}
              </Text>
            </View>
            <View style={{marginHorizontal: 5, marginTop: 20, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text selectable style={{}} >
                clientId:{this.user.deviceId}
              </Text>
            </View>
            <View style={{marginHorizontal: 5, marginTop: 20, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text selectable style={{}} >
                bundleId:{DeviceInfo.getBundleId()}
              </Text>
            </View>
            <View style={{marginHorizontal: 5, marginTop: 20, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text selectable style={{}} >
                开发状态:{__DEV__ ? '是' : '否'}
              </Text>
            </View>
            <View style={{marginHorizontal: 5, marginTop: 20, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text selectable style={{}} >
                uniqueId:{DeviceInfo.getUniqueID()}
              </Text>
            </View>
            <View style={{marginHorizontal: 5, marginTop: 20, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text selectable style={{}} >
                原生版本:{DeviceInfo.getVersion()}
              </Text>
            </View>
            <View style={{marginHorizontal: 5, marginTop: 20, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text selectable style={{}} >
                buildNumber:{DeviceInfo.getBuildNumber()}
              </Text>
            </View>
            <View style={{marginHorizontal: 5, marginTop: 20, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Text selectable style={{}} >
                apnId:{this.state.deviceIdAPN}
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    )
  }
}
