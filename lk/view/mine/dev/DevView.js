
import React, { Component } from 'react'
import {
  PushNotificationIOS,
  Alert
} from 'react-native'
import { Toast } from 'native-base'

import NavigateList from '../../common/NavigateList'
import ScreenWrapper from '../../common/ScreenWrapper'

const { engine } = require('@lk/LK-C')
const { commonUtil} = require('@external/common')

const { debounceFunc } = commonUtil

const config = require('../../../config')
const { dropExtraTable } = require('../../../util')

const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()
const container = require('../../../state')
const versionLocal = require('../../../../package.json').version

const { logPath } = config

export default class BasicInfoView extends ScreenWrapper {
    static navigationOptions =() => ({
      headerTitle: '开发者工具'

    })

    constructor() {
      super()
      this.user = lkApp.getCurrentUser()
    }

    subRender() {
      const { navigation } = this.props
      const ary = [
        {
          title: '软件信息',
          onPress: () => {
            navigation.navigate('InfoView')
          }
        },
        {
          title: '查看即时日志',
          onPress: () => {
            navigation.navigate('LogView', {
              path: logPath.now,
              type: 'now'
            })
          }
        },
        // {
        //   title: '查看错误日志',
        //   onPress: () => {
        //     this.props.navigation.navigate('LogView', {
        //       path: logPath.error,
        //       type: 'error'
        //     })
        //   }
        // },
        {
          title: '查看信息日志',
          onPress: () => {
            navigation.navigate('LogView', {
              path: logPath.info,
              type: 'info'
            })
          }
        },
        {
          title: '查看调试日志',
          onPress: () => {
            navigation.navigate('LogView', {
              path: logPath.debug,
              type: 'debug'
            })
          }
        },
        {
          title: '设置检查更新服务器地址',
          onPress: () => {
            navigation.navigate('SetUpdateUrlView')
          }
        },
        {
          title: 'updateAnyWay',
          onPress: () => {
            const { updateUtil } = container

            const option = {
              customInfo: {
                id: this.user.id,
                name: this.user.name
              },
              updateAnyWay: true,
              versionLocal,
              checkUpdateErrorCb: (error) => {
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
          }
        },
        {
          title: 'NotifyView',
          onPress: () => {
            navigation.navigate('NotifyView', {
              msg: 'test content'
            })
          }
        },
        {
          title: 'test_multiple',
          onPress: () => {
            console.log('haha')
            // Alert.alert('haha')
          },
          pressOnce: false
        },
        {
          title: 'test_once',
          onPress: () => {
            console.log('haha')
            // Alert.alert('haha')
          },
          pressOnce: true
        },
        {
          title: 'test_debounce',
          onPress: debounceFunc(() => {
            console.log('haha')
            // Alert.alert('haha')
          }),
          pressOnce: false
        },
        {
          title: 'throw error',
          onPress: () => {
            Toast.show({
              text: 'throw an error',
              position: 'top'
            })
            throw new Error('this is a test')
          }
        },
        {
          title: 'drop extra table',
          onPress: () => {
            dropExtraTable()
          }
        },
        {
          title: 'animation',
          onPress: () => {
            navigation.navigate('TestView1')
          }
        },
        {
          title: 'DbView',
          onPress: () => {
            navigation.navigate('DbView')
          }
        },
        {
          title: '重置当前账号',
          icon: 'refresh',
          onPress: () => {
            Alert.alert(
              '提示',
              '重置后会删除当前账号的所有数据,请确认是否继续本操作?',
              [
                { text: '取消', onPress: () => {}, style: 'cancel' },
                {
                  text: '确认',
                  onPress: () => {
                    (async () => {
                      await lkApp.asyUnRegister()
                      navigation.navigate('AuthStack')
                    })()
                  }
                }
              ],
              { cancelable: false }
            )
          }
        }
      ]

      return <NavigateList itemAry={ary} />
    }
}
