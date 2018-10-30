
import React, { Component } from 'react'
import {
  Alert,
  ScrollView, Text, View
} from 'react-native'
import {ListItem} from 'react-native-elements'
const {debounceFunc} = require('../../../../common/util/commonUtil')
const config = require('../../config')
const lkApp = require('../../../LKApplication').getCurrentApp()

export default class BasicInfoView extends Component<{}> {
    static navigationOptions =() => {
      return {
        headerTitle: '开发者工具'

      }
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
              path: config.errorLogPath
            })
          }
        },
        {
          title: '查看调试日志',
          onPress: () => {
            this.props.navigation.navigate('LogView', {
              path: config.devLogPath
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
          title: ' 设置检查更新服务器地址',
          onPress: () => {
            this.props.navigation.navigate('SetUpdateUrlView')
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
