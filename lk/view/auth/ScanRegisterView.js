
import React from 'react'
import {
  Image, Keyboard, Text,
  TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native'
import {Toast} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'
const versionLocal = require('../../../package').version
const lkStyle = require('../style')
const {CryptoUtil} = require('@ys/vanilla')
const {decryptAES} = CryptoUtil

export default class ScanRegisterView extends React.Component {
    static navigationOptions =() => {
      return {
        header: null
      }
    }
    constructor (props) {
      super(props)

      this.state = {
      }
    }

    showScanView=() => {
      this.props.navigation.navigate('ScanView', {
        onRead: this.onRead
      })
    }

    dismissKeyboard=() => {
      Keyboard.dismiss()
    }

    onRead = (e) => {
      const {data} = e
      const decryptedText = decryptAES(data)
      const obj = JSON.parse(decryptedText)

      if (obj.action === 'registerForAdmin') {
        this.props.navigation.navigate('CheckCodeView', {
          obj
        })
      } else if (obj.action === 'register') {
        this.props.navigation.navigate('RegisterView', {
          obj,
          qrcode: data
        })
      } else {
        Toast.show({
          text: '该二维码无效',
          position: 'top',
          type: 'warning',
          duration: 5000
        })
      }
    }

    render () {
      const logoView = <Image source={require('../image/1024x1024.png')} style={{width: 150, height: 150, marginBottom: 50, marginTop: 100}} resizeMode="cover"></Image>
      let content = (
        <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
          <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flex: 1, backgroundColor: '#ffffff'}}>

            {logoView}
            <View style={{height: 40, backgroundColor: '#f0f0f0', width: '100%', flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: 4, height: 18, backgroundColor: lkStyle.color.logoColor, marginLeft: 10}}></View>
              <Text style={{color: '#a0a0a0', paddingLeft: 5, fontSize: 14}}>注册</Text>
            </View>
            <View style={{height: 120, backgroundColor: '#ffffff', width: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
              <TouchableOpacity style={{height: 50,
                backgroundColor: '#ffffff',
                width: '100%',
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderColor: lkStyle.color.secondColor,
                justifyContent: 'flex-start',
                alignItems: 'center'}}
              onPress={this.showScanView}>
                <Icon name="qrcode" size={30} color={lkStyle.color.logoColor} style={{margin: 10}}/>
                <Text style={{}}>扫码注册</Text>

              </TouchableOpacity>
            </View>
            <View style={{flex: 1, width: '100%', backgroundColor: '#ffffff'}}>
            </View>
            <View style={{height: 60, width: '100%', backgroundColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: '#a0a0a0', textAlign: 'center', fontSize: 10}}>版本：v{versionLocal}</Text>
            </View>

          </View>
        </TouchableWithoutFeedback>
      )
      return content
    }
}
