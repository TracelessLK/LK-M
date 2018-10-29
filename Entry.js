
import React, { Component } from 'react'
import {
  YellowBox,
  StyleSheet, View,
  Alert
} from 'react-native'
import {Root} from 'native-base'
import Promise from 'bluebird'
import LKEntry from './lk/LKEntry'
const ErrorUtilRN = require('ErrorUtils')

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Class RCTC'])

const {ErrorUtil, ErrorStock} = require('@ys/react-native-collection')
const {setGlobalErrorHandler} = ErrorUtil
const option = {
  // todo error upload
  productionProcess: (error) => {
    Alert.alert(error.toString())
  },
  ErrorUtilRN
}
setGlobalErrorHandler(option)
global.Promise = Promise

const errorStock = new ErrorStock()
global.onunhandledrejection = function onunhandledrejection (error) {
  if (error instanceof Error) {
    errorStock.processError({error})
  }
}
// console.log(global)
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
