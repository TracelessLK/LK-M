import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import LottieView from 'lottie-react-native';

export default class View1 extends Component<{}> {
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
      <LottieView
        source={require('../../../../../resource/animations/9squares-AlBoardman.json')}
        autoPlay
        loop
      />
    )
  }
}

View1.defaultProps = {}

View1.propTypes = {}
