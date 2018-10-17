
import React, { Component } from 'react'
import {
  YellowBox,
  StyleSheet, View
} from 'react-native'
import {Root} from 'native-base'
import Promise from 'bluebird'
import LKEntry from './lk/LKEntry'
const ErrorUtilRN = require('ErrorUtils')

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Class RCTC'])

const {ErrorUtil} = require('@ys/react-native-collection')
const {processError} = ErrorUtil
const option = {
  // todo error upload
  productionProcess: () => {

  },
  ErrorUtilRN
}
processError(option)
global.Promise = Promise

global.onunhandledrejection = function onunhandledrejection (error) {
  if (error instanceof Error) {
    console.log(error)
  }
}

export default class Entry extends Component<{}> {
  render () {
    return (
      <Root>
        <View style={styles.container}>
          <LKEntry></LKEntry>
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
