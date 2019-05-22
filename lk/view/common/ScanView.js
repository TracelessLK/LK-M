import React from 'react'
import {
  StyleSheet, Vibration, View, TouchableOpacity, Text
} from 'react-native'
import Camera, { RNCamera } from 'react-native-camera'
import _ from 'lodash'
import ScreenWrapper from './ScreenWrapper'

export default class ScanView extends ScreenWrapper {
    static navigationOptions =() => ({
      headerTitle: '扫描二维码'
    })

    // todo android no reaction, render when unmounted, camera is deprecated
    subRender() {
      return (
        <View style={styles.container}>
          <RNCamera
            onBarCodeRead={_.once((e) => {
              const {onRead, vibrate = true, goBack = true} = this.props.navigation.state.params
              if (vibrate) {
                Vibration.vibrate()
              }
              if (goBack) {
                this.props.navigation.goBack()
              }
              onRead(e)
            })}
            style={styles.preview}
            aspect={Camera.constants.Aspect.full}
          >
            <View style={{
              flex: 1, backgroundColor: '#000', opacity: 0.5, width: '100%'
            }}
            />
            <View style={{
              width: '100%', height: 250, flexDirection: 'row', justifyContent: 'space-between'
            }}
            >
              <View style={{
                flex: 1, backgroundColor: '#000', opacity: 0.5, height: '100%'
              }}
              />
              <View style={{
                width: 250, height: 250, borderWidth: 1, borderColor: '#f0f0f0', borderStyle: 'dotted'
              }}
              >
                <View style={{
                  width: 15, height: 15, borderLeftWidth: 2, borderTopWidth: 2, borderColor: '#f9e160'
                }}
                />
                <View style={{
                  width: 15, height: 15, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#f9e160', right: 0, position: 'absolute'
                }}
                />
                <View style={{
                  width: 15, height: 15, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: '#f9e160', bottom: 0, position: 'absolute'
                }}
                />
                <View style={{
                  width: 15, height: 15, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#f9e160', bottom: 0, right: 0, position: 'absolute'
                }}
                />
              </View>
              <View style={{
                flex: 1, backgroundColor: '#000', opacity: 0.5, height: '100%'
              }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack()
              }}
              style={{
                flex: 2,
                backgroundColor: '#000',
                opacity: 0.5,
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            ><Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>取  消</Text>
            </TouchableOpacity>

          </RNCamera>
        </View>
      )
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
