
// @flow

import React from 'react'
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  RefreshControl,
  AppState,
  BackHandler, ActivityIndicator
} from 'react-native'
import NetIndicator from '../common/NetIndicator'
import ScreenWrapper from '../common/ScreenWrapper'
import ChatItem from "./ChatItem"

const { commonUtil, PushUtil } = require('@external/common')

const { removeNotify } = PushUtil
const { debounceFunc } = commonUtil
const { engine } = require('@lk/LK-C')

const Application = engine.Application
const lkApp = Application.getCurrentApp()
const chatManager = engine.ChatManager
const addPng = require('../image/add.png')
const { NetInfoUtil } = require('@ys/react-native-collection')
const container = require('../../state')

container.NetInfoUtil = NetInfoUtil
const { runNetFunc } = require('../../util')

export default class RecentView extends ScreenWrapper {
    static navigationOptions =({ navigation }) => {
      const size = 20
      let headerTitle = navigation.getParam('headerTitle')
      headerTitle = headerTitle || '消息'
      return {
        headerTitle,
        headerRight:
  <TouchableOpacity onPress={navigation.getParam('optionToChoose')}>
    <Image source={addPng} style={{ width: size, height: size, marginHorizontal: 10 }} resizeMode="contain" />
  </TouchableOpacity>
      }
    }

    constructor(props) {
      super(props)
      this.state = {
        contentAry: null,
        refreshing: false
      }
      this.eventAry = ['msgChanged', 'recentChanged']
      // todo: store all not undefined value
      this.channel = lkApp.getLKWSChannel()
      this.user = lkApp.getCurrentUser()
      const checkNotify = (res) => {
        const { _data, _alert } = res
        if (_data) {
          const { type } = _data
          if (type === 'notify') {
            this.props.navigation.navigate('NotifyView', {
              msg: _alert
            })
          }
        }
      }
      new PushUtil({
        onNotfication: (res) => {
          checkNotify(res)
        },
        onInitialNotification: (res) => {
          if (res) {
            checkNotify(res)
            const { _data: data } = res
            const { senderId, chatId, isGroup } = data
            if (isGroup) {
              // this.chat({
              //   otherSideId: isGroup ? chatId : senderId,
              //   isGroup
              // })
            }
          }
        }
      })
    }

  onBackPress = () => {
    BackHandler.exitApp()
  }

  optionToChoose = () => {
    this.props.navigation.navigate('AddGroupView')
    // const {navigation} = this.props
    // let BUTTONS = ['发起群聊',
    //   // '添加外部好友',
    //   '取消']
    // let CANCEL_INDEX = BUTTONS.length - 1
    // ActionSheet.show(
    //   {
    //     options: BUTTONS,
    //     cancelButtonIndex: CANCEL_INDEX,
    //     title: ''
    //   },
    //   buttonIndex => {
    //     if (buttonIndex === 0) {
    //       this.props.navigation.navigate('AddGroupView')
    //     } else if (buttonIndex === 1) {
    //       // addExternalFriend({navigation})
    //     }
    //   }
    // )
  }

    update=() => {
      this.updateRecent()
    }

    componentWillUnmount =() => {
      for (const event of this.eventAry) {
        chatManager.un(event, this.update)
      }
      lkApp.un('netStateChanged', this.netStateChangedListener)
      chatManager.un('msgBadgeChanged', this.msgBadgeChangedListener)

      AppState.removeEventListener('change', this._handleAppStateChange)
    }

  msgBadgeChangedListener = ({param: {num}}) => {
    this.resetHeaderTitle(num)
  }

    netStateChangedListener = (option) => {
      const {param} = option
      if (param.isConnected) {
        this.connectionOpen()
      } else {
        this.connectionFail()
      }
    }

    componentDidMount=() => {
      const { navigation } = this.props
      lkApp.login()

      for (const event of this.eventAry) {
        chatManager.on(event, this.update)
      }

      chatManager.on('msgBadgeChanged', this.msgBadgeChangedListener)
      this.updateRecent()
      navigation.setParams({ optionToChoose: this.optionToChoose })

      lkApp.on('netStateChanged', this.netStateChangedListener)

      AppState.addEventListener('change', this._handleAppStateChange)
    }

    _handleAppStateChange = (appState) => {
      if (appState === 'active') {
        this.addActivityIndicator()
        // this.asyGetAllDetainedMsg({ minTime: 500 })
        removeNotify()
      }
    }

    connectionFail = () => {
      const { navigation } = this.props
      navigation.setParams({
        headerTitle: '消息(未连接)'
      })
      const msg = this.getConnectionMsg()
      if (NetInfoUtil.online) {
        this.setState({
          msg,
          type: 'connectionFail'
        })
      } else {
        this.setState({
          msg,
          type: 'networkFail'
        })
      }
    }

    getConnectionMsg() {
      let result
      if (NetInfoUtil.online) {
        result = '与服务器的连接已断开'
      } else {
        result = '当前网络不可用,请检查您的网络设置'
      }
      return result
    }

    connectionOpen = () => {
      // this.asyGetAllDetainedMsg()
      this.resetHeaderTitle()
    }

  getDefaultContent = () => {
    return (
      <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => { this.props.navigation.navigate('ContactTab') }}
          style={{
            marginTop: 30, width: '90%', height: 50, borderColor: 'silver', borderWidth: 1, borderRadius: 5, flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
          }}
          >
          <Text style={{ fontSize: 15, textAlign: 'center', color: 'silver' }}>开始和好友聊天吧!</Text>
        </TouchableOpacity>
      </View>
    )
  }

     updateRecent = async () => {
       const user = lkApp.getCurrentUser()
       const chatAry = await chatManager.getAllChat(user.id)
       // console.log({chatAry})

       let contentAry

       if (chatAry.length) {
         contentAry = chatAry.map(ele => {
           const {isGroup, avatar, id, chatName, msgContent, activeTime, newMsgNum} = ele

           const item = {
             onPress: () => {
               this.chat({
                 isGroup,
                 otherSideId: id,
                 chatName
               })
             },
             imageAry: avatar ? avatar.split('@sep@') : [],
             name: chatName,
             content: msgContent,
             time: new Date(activeTime),
             newMsgNum,
             id,
             deletePress: async () => {
               await chatManager.asyDeleteChat(this.user.id, id)
               this.update()
             }
           }
           const result = <ChatItem item={item} key={item.id} />
           return result
         })
       } else {
         contentAry = this.getDefaultContent()
       }

       this.setState({
         contentAry
       })
       this.resetHeaderTitle()
     }

    chat = debounceFunc((option) => {
      this.props.navigation.navigate('ChatView', option)
    })

    resetHeaderTitle = async (num) => {
      if (container.connectionOK) {
        if (!num) {
          num = await chatManager.asyGetAllMsgNotReadNum(this.user.id)
        }
        const { navigation } = this.props
        navigation.setParams({
          headerTitle: `消息${num ? `(${num})` : ''}`
        })
      }
    }

  addActivityIndicator = async () => {
    const { navigation } = this.props
    const num = await chatManager.asyGetAllMsgNotReadNum(this.user.id)
    const headerTitle = `消息${num ? `(${num})` : ''}`
    navigation.setParams({
      headerTitle: (
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'white', fontSize: 20, fontWeight: '500', textAlign: 'left', marginHorizontal: 16}}>{headerTitle}</Text>
          <ActivityIndicator size='small' color='#F5F5F5'></ActivityIndicator>
        </View>
      )
    })
    // const psAry = [this.channel.asyReset(), new Promise((resovle) => {
    //   setTimeout(() => {
    //     resovle()
    //   }, 1000 * 2)
    // })]
    // await Promise.all(psAry)
    await this.channel.asyReset()
    this.resetHeaderTitle()
  }

  asyGetAllDetainedMsg = (option = {}) => {
    const { minTime = 0, refreshControl, showWarning = false } = option
    const { navigation } = this.props

    runNetFunc(async () => {
      if (refreshControl) {
        this.setState({
          refreshing: true
        })
      }

      navigation.setParams({
        headerTitle: '消息(正在接收中...)'
      })
      const start = Date.now()
      await this.channel.asyGetAllDetainedMsg()
      const reset = () => {
        // console.log('reset')
        this.resetHeaderTitle()
        this.setState({
          refreshing: false
        })
      }
      let diff = minTime - (Date.now() - start)
      diff = diff > 0 ? diff : 0
      setTimeout(reset, diff)
    }, { showWarning })
  }

  subRender () {
    return (
      <View style={{
        flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff'
      }}
      >
        <NetIndicator />
        <ScrollView
          style={{ width: '100%', paddingTop: 10 }}
          keyboardShouldPersistTaps="always"
          refreshControl={(
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.asyGetAllDetainedMsg({ refreshControl: true, showWarning: true, minTime: 1000 })
              }}
            />
)}
        >
          {this.state.contentAry}
        </ScrollView>
      </View>
    )
  }
}
