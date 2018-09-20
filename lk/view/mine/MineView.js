
import React, { Component } from 'react'
import {
  Alert,
  ScrollView, Text,
  View
} from 'react-native'
import { Avatar, Icon, ListItem } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker'
import {
  Toast
} from 'native-base'
import RNFetchBlob from 'react-native-fetch-blob'
const common = require('@external/common')
const {commonUtil} = common
const {debounceFunc} = commonUtil
const {getAvatarSource} = require('../../util')
const versionLocal = require('../../../package.json').version
const config = require('../config')
const lkApp = require('../../LKApplication').getCurrentApp()
const chatManager = require('../../core/ChatManager')

export default class MineView extends Component<{}> {
    static navigationOptions =() => {
      return {
        headerTitle: '我'
      }
    }
    constructor (props) {
      super(props)
      this.user = lkApp.getCurrentUser()

      let picUrl = this.user.pic
      const avatarSource = getAvatarSource(picUrl)
      this.state = {
        avatarSource
      }
    }

    update = () => {
      this.setState({update: true})
    }

    clear=() => {
      Alert.alert(
        '提示',
        '清除聊天记录后不可恢复,请确认是否继续本操作?',
        [
          {text: '取消', style: 'cancel'},
          {text: '确认',
            onPress: () => {
              chatManager.clear()
              Toast.show({
                text: '聊天记录已经全部清空!',
                position: 'top',
                type: 'success',
                duration: 1000
              })
            }}
        ],
        { cancelable: false }
      )
    }

    showScanView=debounceFunc(() => {
      this.props.navigation.navigate('ScanView')
    })

    setAvatar (image) {
      RNFetchBlob.fs.readFile(image.path, 'base64')
        .then((data) => {
          const uri = 'data:image/jpeg;base64,' + data

          this.setState({
            avatarSource: {
              uri
            }
          })
        })
    }

    render () {
      const list2 = [
        {
          title: `个人基本信息`,
          icon: 'contacts',
          onPress: debounceFunc(() => {
            this.props.navigation.navigate('BasicInfoView')
          })
        },
        {
          title: `清除聊天记录`,
          icon: 'refresh',
          onPress: this.clear
        },

        {
          title: `扫码授权`,
          icon: 'crop-free',
          onPress: this.showScanView
        },
        {
          title: config.isPreviewVersion ? `预览版本:${versionLocal}` : `当前版本:${versionLocal}`,
          icon: 'new-releases',
          onPress: debounceFunc(() => {
            this.props.navigation.navigate('VersionView', {
            })
          })
        }
      ]

      if (config.isDevMode) {
        list2.push(
          {
            title: `开发者工具`,
            icon: 'https',
            onPress: debounceFunc(() => {
              this.props.navigation.navigate('DevView', {
              })
            })
          })
      }

      const pickerOption = {
        width: 300,
        height: 300,
        cropping: true
      }
      const style = {
        listStyle: {
          backgroundColor: 'white', marginTop: 20
        }
      }

      return (
        <ScrollView >
          <View style={style.listStyle}>
            <ListItem
              title={this.user.name}
              rightIcon={
                <Icon name='qrcode' type="font-awesome" iconStyle={{margin: 10}} color='gray'
                  raised
                  onPress={debounceFunc(() => {
                    this.props.navigation.navigate('QrcodeView', {
                      qrcode: {
                        uid: this.user.id,
                        ip: this.user.ip,
                        code: 'LK',
                        action: 'addFriend'
                      },
                      avatarUrl: this.state.avatarSource.uri
                    })
                  })}
                />}
              avatar={<Avatar
                large
                containerStyle={{marginRight: 5}}
                source={this.state.avatarSource}
                onPress={() => {
                  Alert.alert(
                    '设置头像',
                    '请选择头像设置方式',
                    [
                      {text: '取消', onPress: () => {}},
                      {text: '拍照',
                        onPress: () => {
                          ImagePicker.openCamera(pickerOption).then(image => {
                            this.setAvatar(image)
                          }).catch(err => {
                            console.log(err)
                          })
                        }},
                      {text: '从相册获得',
                        onPress: () => {
                          ImagePicker.openPicker(pickerOption).then(image => {
                            this.setAvatar(image)
                          }).catch(err => {
                            console.log(err)
                          })
                        }}
                    ],
                    { cancelable: false }
                  )
                }}
                activeOpacity={0.7}
              />}
              titleStyle={{fontSize: 18, color: '#424242'}}
            />

          </View>
          <View style={style.listStyle}>
            {
              list2.map((item, i) =>
                <ListItem
                  key={i}
                  title={item.title}

                  rightIcon={item.rightIconColor ? {style: {color: item.rightIconColor}} : {}}
                  leftIcon={{name: item.icon, style: {}}}
                  subtitle={item.subtitle}
                  onPress={item.onPress}
                />
              )
            }
          </View>
          <View style={{backgroundColor: 'white',
            marginVertical: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12}}>
            <Text style={{fontSize: 17, color: '#e53d59'}} >退出登录</Text>
          </View>
        </ScrollView>
      )
    }
}
