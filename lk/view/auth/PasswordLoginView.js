
import React, { Component } from 'react'
import {

  Text,
  TextInput,
  View
} from 'react-native'
import {
  Card,
  CardItem,
  Button,
  Toast
} from 'native-base'
const md5 = require('crypto-js/md5')
const {engine} = require('LK-C')

let Application = engine.getApplication()
const lkApplication = Application.getCurrentApp()
const style = require('../style')

export default class PasswordLoginView extends Component<{}> {
  static navigationOptions =() => {
    return {
      headerTitle: '登录'
    }
  }
  constructor (props) {
    super(props)
    const {user} = this.props.navigation.state.params
    this.user = user
    this.state = {}
    this.t = ''
  }

  login = () => {
    const {navigation} = this.props

    // console.log({t: this.t})
    if (!this.t) {
      Toast.show({
        text: '请输入密码',
        position: 'top'
      })
    } else {
      const password = md5(this.t).toString()
      if (password === this.user.password) {
        lkApplication.setCurrentUser(this.user)
        navigation.navigate('MainStack')
      } else {
        Toast.show({
          text: '密码错误,请重试',
          position: 'top'
        })
      }
    }
  }

  render () {
    // console.log(style.mainColor)
    return (
      <View style={{alignItems: 'center', marginVertical: 40}}>
        <Card style={{width: '90%'}}>
          <CardItem header bordered>
            <Text>请输入登录密码</Text>
          </CardItem>
          <CardItem bordered>
            <View style={{justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
              <TextInput style={{
                flex: 1,
                color: 'black',
                fontSize: 16,
                paddingHorizontal: 4,
                borderWidth: 1,
                borderColor: '#d0d0d0',
                borderRadius: 5,
                marginHorizontal: 5,
                minHeight: 40,
                backgroundColor: '#f0f0f0',
                marginBottom: 5
              }} autoFocus secureTextEntry onChangeText={t => {
                this.t = t
              }} onSubmitEditing={this.login}
              ></TextInput>
              <Button block style={{width: 60, height: 40, backgroundColor: style.color.mainColor}} onPress={this.login}>
                <Text style={{color: 'white'}}>确认</Text>
              </Button>
            </View>

          </CardItem>
        </Card>
      </View>
    )
  }
}

PasswordLoginView.defaultProps = {

}

PasswordLoginView.propTypes = {

}
