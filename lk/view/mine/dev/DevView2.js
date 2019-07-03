
import React from 'react'
import { Toast } from 'native-base'

import NavigateList from '../../common/NavigateList'
import ScreenWrapper from '../../common/ScreenWrapper'


const { engine } = require('@lk/LK-C')


const config = require('../../../config')

const Application = engine.Application
const lkApp = Application.getCurrentApp()

const { logPath } = config

export default class DevView2 extends ScreenWrapper {
    static navigationOptions =() => ({
      headerTitle: 'DevView2'

    })

    constructor() {
      super()
      this.user = lkApp.getCurrentUser()
    }

    subRender() {
      const { navigation } = this.props
      const ary = [

        {
          title: '查看错误日志',
          onPress: () => {
            this.props.navigation.navigate('LogView', {
              path: logPath.error,
              type: 'error'
            })
          }
        },
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
          title: 'NotifyView',
          onPress: () => {
            navigation.navigate('NotifyView', {
              msg: 'test content'
            })
          }
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
          title: 'animation',
          onPress: () => {
            navigation.navigate('TestView1')
          }
        }
      ]

      return <NavigateList itemAry={ary} />
    }
}
