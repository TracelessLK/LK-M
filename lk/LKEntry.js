
import React, { Component } from 'react'
import {
  YellowBox,
  Linking, Alert
} from 'react-native'
import EntryView from './view/index/EntryView'
import Promise from 'bluebird'
const ErrorUtilRN = require('ErrorUtils')
const util = require('./util')
const {appendToLog} = util

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated in plain JavaScript React classes. Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks.',
  'Module RCTHotUpdate requires',
  'Method `jumpToIndex` is deprecated',
  'Module RNFetchBlob',
  'Failed prop type: Invalid props.style key `NativeBase` supplied to `View`.',
  'a promise was rejected with a non-error',
  'a promise was created in'
])
console.disableYellowBox = true
// console.log(process.env)

const {ErrorUtil, ErrorStock} = require('@ys/react-native-collection')
const {setGlobalErrorHandler} = ErrorUtil
const option = {
  // todo error upload
  productionProcess: (error) => {\
    appendToLog({
      type: 'error',
      content: error.toString()
    })
  },
  ErrorUtilRN,
  resetTime: 1000 * 10
}
setGlobalErrorHandler(option)
global.Promise = Promise

const errorStock = new ErrorStock()
global.onunhandledrejection = function onunhandledrejection (error) {
  if (error instanceof Error) {
    appendToLog({
      type: 'error',
      content: error.toString()
    })
    errorStock.processError({error})
  }
}
// console.log(global)

export default class LKEntry extends Component<{}> {
  componentDidMount () {
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial url is: ' + url)
      }
    }).catch(err => console.error('An error occurred', err))
    Linking.addEventListener('url', event => {
      console.log({linkEvent: event})
    })
  }
  render () {
    return (
      <EntryView uriPrefix='lkapp'></EntryView>
    )
  }
}
