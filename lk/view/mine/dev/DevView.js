
import React, { Component } from 'react'
import {
  Alert,
  ScrollView, Text, View,
  PushNotificationIOS
} from 'react-native'
import { ListItem } from 'react-native-elements'
import { Toast } from 'native-base'

const { engine } = require('@lk/LK-C')

const { debounceFunc } = require('../../../../common/util/commonUtil')
const config = require('../../../config')
const { dropExtraTable } = require('../../../util')

const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()
const container = require('../../../state')
const versionLocal = require('../../../../package.json').version

const { logPath } = config

export default class BasicInfoView extends Component<{}> {
    static navigationOptions =() => ({
      headerTitle: '开发者工具'

    })

    constructor() {
      super()
      this.user = lkApp.getCurrentUser()
    }

    render() {
      const { navigation } = this.props
      const style = {
        listItem: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row'
        },
        listStyle: {
          backgroundColor: 'white', marginTop: 20
        },
        titleStyle: {
          fontSize: 18,
          marginLeft: 10,
          color: '#606060'

        },
        contentStyle: {
          color: '#a0a0a0',
          fontSize: 18
        },
        contentContainer: {
        }
      }
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
            navigation.navigate('NotifyView')
          }
        },
        {
          title: 'test',
          onPress: () => {
            PushNotificationIOS.presentLocalNotification({
              alertBody: 'dsfs'
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
        }
      ]
      const list2 = ary.map(ele => ({
        title: (
          <View style={style.listItem}>
            <View>
              <Text style={style.titleStyle}>
                {ele.title}
              </Text>
            </View>
            <View>
              <Text style={style.contentStyle} />
            </View>
          </View>),
        onPress: debounceFunc(ele.onPress)
      }))

      return (
        <ScrollView>
          <View style={style.listStyle}>
            {
              list2.map((item, i) => (
                <ListItem
                  key={i}
                  title={item.title}
                  component={item.label}
                  rightIcon={item.rightIconColor ? { style: { color: item.rightIconColor } } : {}}
                  onPress={item.onPress}
                />
              ))
            }
          </View>
        </ScrollView>
      )
    }
}
