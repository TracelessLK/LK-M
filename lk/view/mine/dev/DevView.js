
import React from 'react'
import {
  Alert
} from 'react-native'
import { Toast } from 'native-base'

import NavigateList from '../../common/NavigateList'
import ScreenWrapper from '../../common/ScreenWrapper'

const { engine } = require('@lk/LK-C')

const config = require('../../../config')

const Application = engine.Application
const lkApp = Application.getCurrentApp()
const container = require('../../../state')
const versionLocal = require('../../../../package.json').version

const { logPath } = config

export default class DevView extends ScreenWrapper {
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
          title: 'SQL调试',
          onPress: () => {
            navigation.navigate('DbExecuteView')
          }
        },
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
                  text: `检查更新出错了, ${JSON.stringify(error)}`,
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
        },
        {
          title: 'DbDevView',
          onPress: () => {
            navigation.navigate('DbDevView')
          }
        },
        {
          title: 'DevView2',
          onPress: () => {
            navigation.navigate('DevView2')
          }
        }
      ]

      return <NavigateList itemAry={ary} />
    }
}
