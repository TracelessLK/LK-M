import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import LottieView from "lottie-react-native";

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
    return (
      <LottieView style={{position: 'absolute',top: 0}}
        source={require('../../../resource/animations/firework.json')}
        autoPlay
        loop
      />
    )
  }
}

ScrollBottom.defaultProps = {}

ScrollBottom.propTypes = {}
