
import React, { Component } from 'react'
import {
  Alert,
  ScrollView, Text,
  View,
  TouchableOpacity
} from 'react-native'
import { Avatar, Icon, ListItem } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker'
import {
  Toast
} from 'native-base'
import RNFetchBlob from 'react-native-fetch-blob'
import ImageResizer from 'react-native-image-resizer'
import { NetworkInfo } from 'react-native-network-info'
const common = require('@external/common')
const {commonUtil} = common
const {debounceFunc} = commonUtil
const {getAvatarSource} = require('../../util')
const versionLocal = require('../../../package.json').version
const config = require('../../config')
const {engine} = require('@lk/LK-C')

const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()
const chatManager = engine.get('ChatManager')
const userManager = engine.get('UserManager')

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
        avatarSource,
        name: this.user.name
      }
      this.eventAry = ['nameChanged', 'picChanged']
    }

    componentDidMount () {
      for (let ele of this.eventAry) {
        userManager.on(ele, () => {
          this.update(ele)
        })
      }
    }

    componentWillUnmount () {
      for (let ele of this.eventAry) {
        userManager.un(ele, this.update)
      }
    }

    update = (ele) => {
      // console.log({event: ele})
      this.user = lkApp.getCurrentUser()
      const {name, pic} = this.user
      this.setState({name, avatarSource: getAvatarSource(pic)})
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
      this.props.navigation.navigate('ScanView', {
        onRead (event) {
          const {data} = event
          const {action} = data

          if (action === 'authorize') {
            this.authorizeOther(data)
          }
        }
      })
    })

  authorizeOther = (data) => {
    const {addresses, port} = data
    NetworkInfo.getIPAddress(ip => {
      try {
        let ipSeg = ip.substring(0, ip.lastIndexOf('.'))
        let serverIP
        for (let i = 0; i < addresses.length; i++) {
          if (addresses[i].indexOf(ipSeg) === 0) {
            serverIP = addresses[i]
          }
        }

        if (!serverIP) {
          ipSeg = ipSeg.substring(0, ipSeg.lastIndexOf('.'))
          for (let i = 0; i < addresses.length; i++) {
            if (addresses[i].indexOf(ipSeg) === 0) {
              serverIP = addresses[i]
            }
          }
        }
        if (serverIP) {
          let uri = serverIP + ':' + port
          let ws = new WebSocket('ws://' + uri)
          const scanV = this
          ws.onmessage = (message) => {
            let msg = JSON.parse(message.data)
            if (msg.state) { // done
              ws.close()
              Toast.show({
                text: '授权成功',
                position: 'top'
              })
            } else if (msg.msg) {
              Toast.show({
                text: msg.msg,
                position: 'top'
              })
            }
          }
          ws.onerror = function incoming (event) {
            Toast.show({
              text: '网络连接错误 ' + (event ? event.toString() : ''),
              position: 'top'
            })
          }
          ws.onclose = () => {

          }
          ws.onopen = function () {
            let msg = {}
            msg.id = this.user.id
            msg.serverIP = this.user.serverIP
            msg.serverPort = this.user.serverPort
            ws.send(JSON.stringify(msg))
            Toast.show({
              text: '请稍后...',
              position: 'top'
            })
          }
        } else {
          Toast.show({
            text: '目标设备和手机并非连接同一WIFI',
            position: 'top'
          })
        }
      } catch (e) {
        console.info(e)
      }
    })
  }

  setAvatar (image) {
    RNFetchBlob.fs.readFile(image.path, 'base64')
      .then(async (data) => {
        const uri = 'data:image/jpeg;base64,' + data
        const maxSize = 500
        const resized = await ImageResizer.createResizedImage(uri, maxSize, maxSize, 'JPEG', 70, 0, null)
        let resizedUri = await RNFetchBlob.fs.readFile(resized.path, 'base64')
        resizedUri = 'data:image/jpeg;base64,' + resizedUri
        // console.log({resizedUri, uri})
        await userManager.setUserPic(resizedUri)
      })
  }

  render () {
    const {navigation} = this.props
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
      <ScrollView>
        <View style={style.listStyle}>
          <ListItem
            title={this.state.name}
            rightIcon={
              <Icon name='qrcode' type="font-awesome" iconStyle={{margin: 10}} color='gray'
                raised
                onPress={debounceFunc(() => {
                  // this.props.navigation.navigate('QrcodeView', {
                  //   qrcode: {
                  //     uid: this.user.id,
                  //     ip: this.user.ip,
                  //     code: 'LK',
                  //     action: 'addFriend'
                  //   },
                  //   avatarUrl: this.state.avatarSource.uri
                  // })
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
        <TouchableOpacity style={{backgroundColor: 'white',
          marginVertical: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12}} onPress={() => {
          lkApp.setCurrentUser(null)
          navigation.navigate('SelectUserView')
        }}>
          <Text style={{fontSize: 17, color: '#e53d59'}} >退出登录</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}
