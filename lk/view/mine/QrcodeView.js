
import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'

const {engine} = require('@lk/LK-C')

const Application = engine.Application
const lkApp = Application.getCurrentApp()
const {getAvatarSource} = require('../../util')
const defaultAvatar = require('../image/defaultAvatar.png')

export default class QrcodeView extends Component<{}> {
  constructor(props) {
    super(props)
    this.state = {}
    this.user = lkApp.getCurrentUser()
    // console.log(this.user)
  }

  render() {
    return (
      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 40}}>
        <View style={{margin: 20}}>
          <Text>
            扫一扫添加好友吧
          </Text>
        </View>
        <QRCode size={240}
          color='#393a3f'
          value={JSON.stringify({
            id: this.user.id,
            ip: this.user.serverIP,
            port: this.user.serverPort,
            code: 'LK',
            action: 'addFriend'
          })}
          logo={this.user.pic ? getAvatarSource(this.user.pic) : defaultAvatar}
          logoSize={60}
          logoBackgroundColor='transparent'
        />

      </View>)
  }
}

QrcodeView.defaultProps = {

}

QrcodeView.propTypes = {

}
