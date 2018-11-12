
import React, { Component } from 'react'
import {
  YellowBox,
  StyleSheet, View
} from 'react-native'
import {Root} from 'native-base'
import ConfigManager from './Manifest'
let Application = ConfigManager.getApplication();
import DataSource from './lk/store/RNSqlite'
Application.getCurrentApp().start(Application.PLATFORM_RN,DataSource)
import LKEntry from './lk/LKEntry'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Class RCTC'])

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
