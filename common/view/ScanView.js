import React, { Component } from 'react'
import {
  StyleSheet, Vibration, View, TouchableOpacity, Text
} from 'react-native'
import Camera from 'react-native-camera'
const commonUtil = require('../util/commonUtil')
const {debounceFunc} = commonUtil

export default class ScanView extends Component<{}> {
  static navigationOptions =() => {
    return {
      headerTitle: '扫描二维码'
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Camera
          onBarCodeRead={debounceFunc((e) => {
            const {onRead, noVibrate} = this.props.navigation.state.params
            if (!noVibrate) {
              Vibration.vibrate()
            }
            onRead(e)
          }, 1000 * 5)}
          style={styles.preview}
          aspect={Camera.constants.Aspect.full}>
          <View style={{flex: 1, backgroundColor: '#000', opacity: 0.5, width: '100%'}}/>
          <View style={{width: '100%', height: 250, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1, backgroundColor: '#000', opacity: 0.5, height: '100%'}}/>
            <View style={{width: 250, height: 250, borderWidth: 1, borderColor: '#f0f0f0', borderStyle: 'dotted'}}>
              <View style={{width: 15, height: 15, borderLeftWidth: 2, borderTopWidth: 2, borderColor: '#f9e160'}}/>
              <View style={{width: 15, height: 15, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#f9e160', right: 0, position: 'absolute'}}/>
              <View style={{width: 15, height: 15, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#f9e160', bottom: 0, position: 'absolute'}}/>
              <View style={{width: 15, height: 15, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#f9e160', bottom: 0, right: 0, position: 'absolute'}}/>
            </View>
            <View style={{flex: 1, backgroundColor: '#000', opacity: 0.5, height: '100%'}}/>
          </View>
          <TouchableOpacity onPress={() => {
            this.props.navigation.goBack()
          }} style={{
            flex: 2,
            backgroundColor: '#000',
            opacity: 0.5,
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center'
          }}><Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>取  消</Text></TouchableOpacity>

        </Camera>
      </View>)
  }
}

ScanView.propTypes = {

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  preview: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
})
