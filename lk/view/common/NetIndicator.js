import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import {Icon} from 'native-base'

const {engine} = require('@lk/LK-C')

const Application = engine.Application
const lkApp = Application.getCurrentApp()

const {NetInfoUtil} = require('@ys/react-native-collection')

export default class NetIndicator extends Component<{}> {
  constructor (props) {
    super(props)
    this.channel = lkApp.getLKWSChannel()
    this.state = {
      isConnectedToServer: true
    }
  }

  componentWillUnmount =() => {
    lkApp.un('netStateChanged', this.netStateChangedListener)
  }

  componentDidMount=() => {
    lkApp.on('netStateChanged', this.netStateChangedListener)
  }

  netStateChangedListener = ({param}) => {
    if (param.isConnected) {
      this.connectionOpen()
    } else {
      this.connectionFail()
    }
  }

  connectionFail = () => {
    const msg = this.getConnectionMsg()
    if (NetInfoUtil.online) {
      this.setState({
        isConnectedToServer: false,
        msg,
        type: 'connectionFail'
      })
    } else {
      this.setState({
        isConnectedToServer: false,
        msg,
        type: 'networkFail'
      })
    }
  }

  getConnectionMsg () {
    let result
    if (NetInfoUtil.online) {
      result = '与服务器的连接已断开'
    } else {
      result = '当前网络不可用,请检查您的网络设置'
    }
    return result
  }

  connectionOpen = () => {
    // this.channel.asyGetAllDetainedMsg()
    this.setState({
      isConnectedToServer: true
    })
  }

  render () {
    return (
      <View style={{width: '100%'}}>
        {this.state.isConnectedToServer ? null
          : <View style={{height: 40, backgroundColor: '#ffe3e0', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}
            onPress={() => {
              // this.props.navigation.navigate('ConnectionFailView', {type: this.state.type})
            }}
          >
            <Icon name='ios-alert' style={{color: '#eb7265', fontSize: 25, marginRight: 5}}/><Text style={{color: '#606060'}}>{this.state.msg}</Text>
          </View>
        }
      </View>
    )
  }
}

NetIndicator.defaultProps = {}

NetIndicator.propTypes = {}
