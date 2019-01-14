import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import LottieView from 'lottie-react-native';


export default class View3 extends Component<{}> {
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
