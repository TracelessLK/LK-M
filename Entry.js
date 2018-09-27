
import React, { Component } from 'react'
import {
  YellowBox,
  StyleSheet, View
} from 'react-native'
import entryUtil from './common/util/entryUtil'
import {Root} from 'native-base'
import Promise from 'bluebird'

import LKEntry from './lk/LKEntry'
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Class RCTC'])

entryUtil.init()

global.Promise = Promise

global.onunhandledrejection = function onunhandledrejection (error) {
  // Warning: when running in "remote debug" mode (JS environment is Chrome browser),
  // this handler is called a second time by Bluebird with a custom "dom-event".
  // We need to filter this case out:
  if (error instanceof Error) {
    // logError(error)
  }
  console.log(error)
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
