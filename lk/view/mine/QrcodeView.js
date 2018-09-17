
import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
const lkApp = require('../../LKApplication').getCurrentApp()
const {getAvatarSource} = require('../../util')

export default class QrcodeView extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {}
    this.user = lkApp.getCurrentUser()
    let picUrl = this.user.picId
    const avatarSource = getAvatarSource(picUrl)
    this.avatarSource = avatarSource
  }

  render () {
    return (
      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 40}}>
        <View style={{margin: 20}}>
          <Text>
            扫一扫添加好友吧
          </Text>
        </View>
        <QRCode size={240}
          color='#393a3f'
          value={JSON.stringify({a: 12})}
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
