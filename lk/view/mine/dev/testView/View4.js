import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import ScreenWrapper from '../../../common/ScreenWrapper'

export default class View4 extends ScreenWrapper {
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
      <View>
        <Text>View4</Text>
      </View>
    )
  }
}

View4.defaultProps = {}

View4.propTypes = {}
