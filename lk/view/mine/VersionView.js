import React from 'react'

import {
  Alert, Dimensions, View
} from 'react-native'
import {Card} from 'react-native-elements'
import {Button, Icon, Text, Toast, Spinner} from 'native-base'
import ScreenWrapper from '../common/ScreenWrapper'

const versionLocal = require('../../../package.json').version
const config = require('../../config')
const {FuncUtil} = require('@ys/vanilla')

const {debounceFunc} = FuncUtil
const {engine} = require('@lk/LK-C')

const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()
const container = require('../../state')

export default class VersionView extends ScreenWrapper {
    static navigationOptions = () => {
      return {
        headerTitle: '版本信息'
      }
    }

    constructor (props) {
      super(props)
      this.state = {}
      this.user = lkApp.getCurrentUser()
    }

    subRender () {
      const {width} = Dimensions.get('window')
      const style = {
        itemStyle: {
          fontSize: width / 28,
          marginVertical: 10
        }
      }

      return (
        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 50, width: '100%'}}>

          <Card style={{}}>
            <View style={{padding: 50, flexDirection: 'column', width: '90%', marginHorizontal: 5, marginVertical: 20, justifyContent: 'center', alignItems: 'center'}}>
              <Text selectable style={style.itemStyle} onPress={() => {
                this.count++
                if (this.count > 10) {
                  // config.isDevMode = true
                  Alert.alert('你已进入开发模式')
                }

                setTimeout(() => {
                  this.count = 0
                }, 1000 * 10)
              }} >
                {config.isPreviewVersion ? `预览版本:${versionLocal}(${config.previewVersion})` : `当前版本:${versionLocal}`}
              </Text>
              <View style={{marginVertical: 20}}>
                <Button iconLeft info disabled={this.state.checking} onPress={debounceFunc(() => {
                  this.setState({
                    checking: true
                  })
                  const {updateUtil} = container
                  // console.log({updateUtil})

                  const afterCheck = () => {
                    this.setState({
                      checking: false
                    })
                  }
                  const noUpdateCb = () => {
                    afterCheck()
                    Toast.show({
                      text: '当前已是最新版本',
                      position: 'top',
                      type: 'success',
                      duration: 3000
                    })
                  }
                  const option = {
                    customInfo: {
                      id: this.user.id,
                      name: this.user.name
                    },
                    versionLocal,
                    beforeUpdate: afterCheck,
                    noUpdateCb,
                    checkUpdateErrorCb: (error) => {
                      afterCheck()
                      console.log(error)
                      Toast.show({
                        text: '检查更新出错了',
                        position: 'top',
                        type: 'error',
                        duration: 3000
                      })
                    }
                  }
                  updateUtil.checkUpdate(option)
                })
                }>
                  <Icon name='refresh' />
                  <Text>检查更新</Text>
                </Button>
              </View>
            </View>
          </Card>
          {this.state.checking ? <Spinner color='blue' style={{position: 'absolute', top: '10%'}}/> : null}
        </View>)
    }
}

VersionView.defaultProps = {}

VersionView.propTypes = {}
