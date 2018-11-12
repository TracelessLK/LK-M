import React, {Component} from 'react'
import {
  Text,
  View,
  StatusBar, Image
} from 'react-native'
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

  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <View>
        <Text>ExternalView</Text>
      </View>
    )
  }
}

NotifyView.defaultProps = {}

NotifyView.propTypes = {}
