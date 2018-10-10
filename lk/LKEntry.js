
import React, { Component } from 'react'
import {
  YellowBox
} from 'react-native'
import EntryView from './view/index/EntryView'
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated in plain JavaScript React classes. Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks.',
  'Module RCTHotUpdate requires',
  'Method `jumpToIndex` is deprecated',
  'Module RNFetchBlob',
  'Failed prop type: Invalid props.style key `NativeBase` supplied to `View`.',
  'a promise was rejected with a non-error'
])
// console.log(process.env)

export default class LKEntry extends Component<{}> {
  render () {
    return (
      <EntryView></EntryView>
    )
  }
}
