import React, {Component} from 'react'
import {
  Alert,
  Text,
  View,
  Dimensions, ActivityIndicator,
  Keyboard
} from 'react-native'
import {Input, Item, Button, Label, Toast, Form} from 'native-base'
import RSAKey from 'react-native-rsa'
import deviceInfo from 'react-native-device-info'

const {engine} = require('@lk/LK-C')

const Application = engine.Application
const lkApplication = Application.getCurrentApp()

const uuid = require('uuid')
const {PushUtil} = require('@external/common')

const {getAPNDeviceId} = PushUtil
// console.log({getAPNDeviceId, PushUtil })
const md5 = require('crypto-js/md5')

export default class RegisterView extends Component<{}> {
  constructor (props) {
    super(props)
    // const obj = this.props.navigation.state.params.obj
    // console.log(obj)

    this.state = {
      hasCheckCode: true,
      buttonDisabled: false,
      isWating: false
    }
  }

    onChangeText = (t) => {
      this.name = t ? t.trim() : ''
    }

    onChangeText2 = (t) => {
      this.checkCode = t ? t.trim() : ''
    }

    componentDidUpdate () {
      if (this.state.buttonDisabled) {
        setTimeout(() => {
          this.register()
        }, 1000)
      }
    }

    register = async () => {
      const bits = 1024
      const exponent = '10001'
      const rsa = new RSAKey()
      rsa.generate(bits, exponent)
      const publicKey = rsa.getPublicString() // return json encoded string
      const privateKey = rsa.getPrivateString() // return js

      this.password = 'traceless'
      const password = md5(this.password).toString()

      const serverIP = __DEV__ ? '192.168.3.15' : '104.233.169.160/'
      const serverPort = 3001
      const user = {
        name: this.name,
        publicKey,
        privateKey,
        deviceId: uuid(),
        serverIP,
        serverPort,
        password
      }
      const description = {
        brand: deviceInfo.getBrand(),
        device: deviceInfo.getDeviceId()
      }
      const venderDid = await getAPNDeviceId()

      lkApplication.asyRegister(user, venderDid, this.checkCode, this.name, JSON.stringify(description, null, 2)).then((userReturned) => {
        lkApplication.setCurrentUser(userReturned, venderDid)
        this.props.navigation.navigate('MainStack')
      }).catch(error => {
        const errStr = JSON.stringify(error)
        console.log(error)

        Alert.alert(errStr)
        this.setState({buttonDisabled: false, isWating: false})
      })
    }

    render () {
      return (
        <View style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flex: 1, marginTop: 6}}>
          {this.state.isWating ? <ActivityIndicator size='large' style={{position: 'absolute', top: '50%'}}/> : null}
          <Form style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: 15, width: '95%'}}>
            <Item floatingLabel style={{marginBottom: 10}}>
              <Label>请输入昵称</Label>
              <Input ref='input' onChangeText={this.onChangeText}/>
            </Item>
            <Item floatingLabel style={{marginBottom: 10}}>
              <Label>请输入验证码</Label>
              <Input ref='input' onChangeText={this.onChangeText2}/>
            </Item>
          </Form>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Button disabled={this.state.buttonDisabled} ref='button' iconLeft info style={{width: Dimensions.get('window').width - 30, alignItems: 'center', justifyContent: 'center', marginTop: 30}}
              onPress={() => {
                if (!this.name) {
                  Toast.show({
                    text: '请输入昵称',
                    position: 'top',
                    type: 'warning',
                    duration: 3000
                  })
                  return
                }

                if (!this.checkCode && this.state.hasCheckCode) {
                  Toast.show({
                    text: '请输入验证码',
                    position: 'top',
                    type: 'warning',
                    duration: 3000
                  })
                } else {
                  Keyboard.dismiss()
                  this.setState({buttonDisabled: true, isWating: true})
                }
              }}>
              <Text style={{color: 'white'}}>注册</Text>
            </Button>
          </View>

        </View>
      )
    }
}

RegisterView.defaultProps = {}

RegisterView.propTypes = {}
