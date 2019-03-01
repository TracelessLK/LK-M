import React, { Component } from 'react'
import {
  Dimensions,
  Text,
  View,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import LottieView from 'lottie-react-native'
import { Header } from 'react-navigation'

export default class ScrollBottom extends Component<{}> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const { height } = Dimensions.get('window')
    const headerHeight = Header.HEIGHT
    const contentHeight = height - headerHeight - 100
    return (
      <View style={{
        height: contentHeight,
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      >
        <Image source={require('../image/fire.gif')} style={{height:contentHeight}}/>
      </View>

    )
  }
}

ScrollBottom.defaultProps = {}

ScrollBottom.propTypes = {}
