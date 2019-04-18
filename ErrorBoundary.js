import React, { Component } from 'react'
import {
  ScrollView,
  Text
} from 'react-native'

export default class ErrorBoundary extends Component {
  state = {
    error: null
  }

  componentDidCatch(error) {
    this.setState({ error })
  }

  render() {
    if (this.state.error === null) {
      return this.props.children
    }
    return (
      <ScrollView contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>
          {this.state.error.toString()}
        </Text>
      </ScrollView>
    )
  }
}
