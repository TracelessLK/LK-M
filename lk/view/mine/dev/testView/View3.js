import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import LottieView from 'lottie-react-native';
import ScreenWrapper from '../../../common/ScreenWrapper'

export default class View3 extends ScreenWrapper {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  subRender() {
    return (
      <LottieView
        source={this.props.navigation.state.params.source}
        autoPlay
        loop
      />
    )
  }
}

View3.defaultProps = {}

View3.propTypes = {
  source: PropTypes.object
}
