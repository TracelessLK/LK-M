
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
      const list2 = [
        {
          title: (
            <View style={style.listItem}>
              <View>
                <Text style={style.titleStyle}>
                                软件信息
                </Text>
              </View>
              <View>
                <Text style={style.contentStyle}>
                </Text>
              </View>
            </View>),
          onPress: debounceFunc(() => {
            this.props.navigation.navigate('InfoView')
          })
        },
        {
          title: (
            <View style={style.listItem}>
              <View>
                <Text style={style.titleStyle}>
                                查看错误日志
                </Text>
              </View>
              <View style={style.contentContainer}>
                <Text style={[style.contentStyle, {fontSize: 14}]}>
                </Text>
              </View>

            </View>),
          onPress: debounceFunc(() => {
            this.props.navigation.navigate('LogView', {
              path: config.errorLogPath
            })
          })
        },
        {
          title: (
            <View style={style.listItem}>
              <View>
                <Text style={style.titleStyle}>
                                查看调试日志
                </Text>
              </View>
              <View>
                <Text style={style.contentStyle}>
                </Text>
              </View>
            </View>),
          onPress: debounceFunc(() => {
            this.props.navigation.navigate('LogView', {
              path: config.devLogPath
            })
          })
        },
        {
          title: (
            <View style={style.listItem}>
              <View>
                <Text style={style.titleStyle}>
                                数据二维码
                </Text>
              </View>
              <View>
                <Text style={style.contentStyle}>
                </Text>
              </View>
            </View>),
          onPress: debounceFunc(() => {
            this.props.navigation.navigate('DataQrView', {
            })
          })
        },
        {
          title: (
            <View style={style.listItem}>
              <View>
                <Text style={style.titleStyle}>
                                重置
                </Text>
              </View>
              <View>
                <Text style={style.contentStyle}>
                </Text>
              </View>
            </View>),
          onPress: debounceFunc(() => {
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
          })
        },

        {
          title: (
            <View style={style.listItem}>
              <View>
                <Text style={style.titleStyle}>
                                设置检查更新服务器地址
                </Text>
              </View>
              <View>
                <Text style={style.contentStyle}>
                </Text>
              </View>
            </View>),
          onPress: debounceFunc(() => {
            this.props.navigation.navigate('SetHostView')
          })
        }
      ]

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
