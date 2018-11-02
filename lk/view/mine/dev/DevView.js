
import React, { Component } from 'react'
import {
  Alert,
  ScrollView, Text, View
} from 'react-native'
import {ListItem} from 'react-native-elements'
import {Toast} from 'native-base'
const {debounceFunc} = require('../../../../common/util/commonUtil')
const config = require('../../../config')
const lkApp = require('../../../LKApplication').getCurrentApp()
const container = require('../../../state')
const versionLocal = require('../../../../package.json').version
const {logPath} = config

export default class BasicInfoView extends Component<{}> {
    static navigationOptions =() => {
      return {
        headerTitle: '开发者工具'

      }
    }

    constructor () {
      super()
      this.user = lkApp.getCurrentUser()
    }

    render () {
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
            this.props.navigation.navigate('InfoView')
          }
        },
        {
          title: '查看错误日志',
          onPress: () => {
            this.props.navigation.navigate('LogView', {
              path: logPath.error
            })
          }
        },
        {
          title: '查看信息日志',
          onPress: () => {
            this.props.navigation.navigate('LogView', {
              path: logPath.info
            })
          }
        },
        {
          title: '查看调试日志',
          onPress: () => {
            this.props.navigation.navigate('LogView', {
              path: logPath.debug
            })
          }
        },
        {
          title: '重置',
          onPress: () => {
            Alert.alert(
              '提示',
              '重置后会删除当前账号的所有数据,请确认是否继续本操作?',
              [
                {text: '取消', onPress: () => {}, style: 'cancel'},
                {text: '确认',
                  onPress: () => {
                    (async () => {
                      await lkApp.asyUnRegister()
                      this.props.navigation.navigate('AuthStack')
                    })()
                  }
                }
              ],
              { cancelable: false }
            )
          }
        },
        {
          title: '设置检查更新服务器地址',
          onPress: () => {
            this.props.navigation.navigate('SetUpdateUrlView')
          }
        },
        {
          title: 'updateAnyWay',
          onPress: () => {
            const {updateUtil} = container

            const option = {
              customInfo: {
                id: this.user.id,
                name: this.user.name
              },
              'updateAnyWay': true,
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
          title: '2:38',
          onPress: () => {
          }
        }
        // {
        //   title: 'test',
        //   onPress: () => {
        //
        //   }
        // },
        // {
        //   title: 'test',
        //   onPress: () => {
        //
        //   }
        // },
        // {
        //   title: 'test',
        //   onPress: () => {
        //
        //   }
        // }
      ]
      const list2 = ary.map(ele => {
        return {
          title: (
            <View style={style.listItem}>
              <View>
                <Text style={style.titleStyle}>
                  {ele.title}
                </Text>
              </View>
              <View>
                <Text style={style.contentStyle}>
                </Text>
              </View>
            </View>),
          onPress: debounceFunc(ele.onPress)
        }
      })

      return (
        <ScrollView >
          <View style={style.listStyle}>
            {
              list2.map((item, i) =>
                <ListItem
                  key={i}
                  title={item.title}
                  component={item.label}
                  rightIcon={item.rightIconColor ? {style: {color: item.rightIconColor}} : {}}
                  onPress={item.onPress}
                />
              )
            }
          </View>
        </ScrollView>
      )
    }
}
