import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'

export default class DbView extends Component<{}> {
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
      <View>
        <Text>DbView</Text>
      </View>
    )
  }
}

DbView.defaultProps = {}

DbView.propTypes = {}
