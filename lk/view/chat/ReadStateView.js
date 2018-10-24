import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'

export default class ReadStateView extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    return (
      <View>
        <Text>ReadStateView</Text>
      </View>
    )
  }
}

ReadStateView.defaultProps = {}

ReadStateView.propTypes = {}
