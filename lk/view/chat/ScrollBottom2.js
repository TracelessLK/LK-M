import React, { Component } from 'react'
import {
  Dimensions,
  View,
  Image
} from 'react-native'
//import PropTypes from 'prop-types'
//import LottieView from 'lottie-react-native'
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
    const contentHeight = height - headerHeight
    return (
      <View style={{
        height: contentHeight,
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      >
        <Image source={require('../image/grayLogo.png')}
          style={{height: contentHeight / 3}} resizeMode='contain'/>
      </View>

    )
  }
}

ScrollBottom.defaultProps = {}

ScrollBottom.propTypes = {}
