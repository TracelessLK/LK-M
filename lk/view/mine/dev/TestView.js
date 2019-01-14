import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import {
  Button
} from 'native-base'
import Test from './testView/View1'

export default class TestView extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    return <Test/>
  }
}

TestView.defaultProps = {}

TestView.propTypes = {}
