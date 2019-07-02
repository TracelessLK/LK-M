import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View
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
      <ScrollView >
        <View style={{marginVertical: 20}}>
          <Text>
            {this.state.error.toString()}
          </Text>
        </View>
      </ScrollView>
    )
  }
}
