import React, {Component} from 'react'
import {
  Text,
  View,
  Linking,
  Button
} from 'react-native'
import {Card, CardItem, Body} from 'native-base'
const {engine} = require('@lk/LK-C')

const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()

export default class ConnectionFailView extends Component<{}> {
  static navigationOptions =() => {
    return {
      headerTitle: '网络连接不可用'
    }
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.user = lkApp.getCurrentUser()
  }

  render () {
    const {type} = this.props.navigation.state.params
    let content = null
    const style1 = {fontSize: 16, color: '#606060'}
    if (type === 'connectionFail') {
      content = <View >
        <View style={{marginVertical: 20}}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>与服务器连接已断开</Text>
        </View>
        <Card>
          <CardItem header bordered>
            <Text style={{}}>服务器信息</Text>
          </CardItem>
          <CardItem>
            <Body>
              <View style={{marginVertical: 10}}>
                <Text style={style1}>IP: {this.user.serverIP}</Text>
              </View>
              <View style={{}}>
                <Text style={style1}>Port: {this.user.serverPort}</Text>
              </View>
            </Body>
          </CardItem>
        </Card>
        <View style={{marginVertical: 20}}>
          <Text style={style1}>请联系管理员检查服务器是否宕机</Text>
        </View>
      </View>
    } else {
      content = <View >
        <View style={{marginVertical: 20}}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>未能连接到互联网</Text>
        </View>
        <View style={{marginVertical: 20}}>
          <Text style={style1}>你的设备未启用网络连接或无线局域网络</Text>
        </View>
        <Button title='检查LK网络设置' onPress={()=>{
          Linking.canOpenURL('app-settings:').then(supported => {

            console.log(`Settings url works`)
            Linking.openURL('app-settings:')
          }).catch(error => {
            console.log(`An error has occured: ${error}`)
          })}
        }>

        </Button>
      </View>
    }
    return <View style={{margin: 20}}>
      {content}
    </View>
  }
}

ConnectionFailView.defaultProps = {}

ConnectionFailView.propTypes = {}
