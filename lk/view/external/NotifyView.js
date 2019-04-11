import React, {Component} from 'react'
import {
  Text,
  View,
  StatusBar, Image,Button
} from 'react-native'
import { AndroidBackHandler } from 'react-navigation-backhandler'

const style = require('../style')
const backImg = require('../image/back-icon.png')

export default class NotifyView extends Component<{}> {
  static navigationOptions = () => {
    return {
      headerTitle: '通知',
      headerBackground: (
        <StatusBar
          barStyle="light-content"
          backgroundColor={style.color.mainColor}
        />
      ),
      headerStyle: {
        backgroundColor: '#303030'
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerBackTitleStyle: {
        color: 'white'
      },
      headerBackImage: (
        <Image style={{width: 30, height: 30}} source={backImg}></Image>
      )
    }
  }


  render () {
    const {msg} = this.props.navigation.state.params
    return (
      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 30}}>{msg}</Text>
        {/*<AndroidBackHandler onBackPress={() => {*/}
        {/*  this.props.navigation.goBack()*/}
        {/*  return true*/}
        {/*}}*/}
        {/*/>*/}
        <Button title='click' onPress={() => {
          //fixme: can't go back
          this.props.navigation.goBack()
        }}></Button>
      </View>
    )
  }
}

NotifyView.defaultProps = {}

NotifyView.propTypes = {}
