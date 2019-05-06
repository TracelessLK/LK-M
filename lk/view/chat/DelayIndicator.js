
import React, { Component } from 'react'
import {
  View
} from 'react-native'
import PropTypes from 'prop-types'
import LottieView from 'lottie-react-native'

export default class My extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {
      content: null
    }
  }

  componentDidMount () {
    this.hasMounted = true

    setTimeout(() => {
      if (this.hasMounted) {
        this.setState({
          content: (
            <LottieView style={{width: 200}} autoPlay loop source={require('../../../resource/animations/loading')}/>

          )})
      }
    }, this.props.delay)
  }

  componentWillUnmount () {
    this.hasMounted = false
  }

  render () {
    return (
      <View style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {this.state.content}
      </View>
    )
  }
}

My.defaultProps = {
  delay: 1000
}

My.propTypes = {
  delay: PropTypes.number
}
