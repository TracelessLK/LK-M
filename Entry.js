
import React, { Component } from 'react'
import {
  YellowBox,
  StyleSheet, View
} from 'react-native'
import {Root} from 'native-base'
import {isFirstTime, markSuccess} from 'react-native-update'


import LKEntry from './lk/LKEntry'
import ErrorBoundary from './ErrorBoundary'

const {engine} = require('@lk/LK-C')


if (isFirstTime) {
  markSuccess()
}

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Class RCTC'])

export default class Entry extends Component<{}> {
  render() {
    return (
      <Root>
        <View style={styles.container}>
          <ErrorBoundary>
            <LKEntry />
          </ErrorBoundary>
        </View>
      </Root>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})
