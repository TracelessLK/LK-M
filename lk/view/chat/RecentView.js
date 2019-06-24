
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
import MessageListItem from "./MessageListItem";

const { commonUtil, MessageList, PushUtil } = require('@external/common')

const { removeNotify } = PushUtil
const { debounceFunc } = commonUtil
const { getAvatarSource } = require('../../util')
const { engine } = require('@lk/LK-C')

const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()
const chatManager = require('../../manager/LKChatManager')

const ContactManager = engine.get('ContactManager')
//const _ = require('lodash')
const addPng = require('../image/add.png')
const { NetInfoUtil } = require('@ys/react-native-collection')
const container = require('../../state')

container.NetInfoUtil = NetInfoUtil
const { runNetFunc } = require('../../util')
const { StringUtil } = require('@ys/vanilla')

const { stripNewline } = StringUtil

type GetMsgOption = {
  userId: string,
  chatId: string,
  newMsgNum: number,
  isGroup: boolean,
  chatName: string,
  createTime: string
}

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
      this.eventAry = ['msgChanged', 'recentChanged', 'msgReceived', 'msgRead', 'msgBadgeChanged']
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
              this.chat({
                otherSideId: isGroup ? chatId : senderId,
                isGroup
              })
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
      this.channel.un('connectionFail', this.connectionFail)
      this.channel.un('connectionOpen', this.connectionOpen)
      AppState.removeEventListener('change', this._handleAppStateChange)
    }

    componentDidMount=() => {
      const { navigation } = this.props
      lkApp.login()


      for (const event of this.eventAry) {
        chatManager.on(event, this.update)
      }
      this.updateRecent()
      navigation.setParams({ optionToChoose: this.optionToChoose })

      this.channel.on('connectionFail', this.connectionFail)
      this.channel.on('connectionOpen', this.connectionOpen)
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

    async getMsg(option: GetMsgOption) {
      const {
        userId, chatId, newMsgNum, isGroup, chatName, createTime, content, type, sendTime, sendName, pic, contactId
      } = option
      const result = {
        isGroup
      }
      // const msgAry = await chatManager.asyGetMsgs(userId, chatId)
      // const lastMsg = await chatManager.asyGetLastMsg(userId, chatId)
      let obj = {
        deletePress: () => {
          this.deleteRow(chatId)
        }
      }
      console.log("chatName:",chatName)
      if (isGroup) {
        obj.id = chatId
        obj.name = chatName
        obj.newMsgNum = newMsgNum
        if (sendTime) {
          obj.content = this.getMsgContent(content, type)
          obj.time = new Date(sendTime)
        } else {
          obj.content = '一起群聊吧'
          obj.time = new Date(createTime)
        }

        const memberAry = await chatManager.asyGetGroupMembers(chatId)

        const picAry = memberAry.map(ele => ele.pic)
        obj.image = picAry
        obj.onPress = () => {
          const param = {
            isGroup: true,
            otherSideId: chatId
          }
          this.chat(param)
        }
      } else if (sendTime) {
        // const msg = lastMsg
        // const { sendTime, content, type } = msg
        // const person = await ContactManager.asyGet(userId, chatId)
        // const { name, pic } = person
        obj.time = new Date(sendTime)
        obj.content = this.getMsgContent(content, type)
        obj.sendTime = sendTime
        obj.newMsgNum = newMsgNum
        obj.name = sendName
        // obj.person = person
        obj.id = chatId
        obj.image = getAvatarSource(pic)

        obj.onPress = () => {
          this.chat({
            otherSideId: contactId,
            isGroup: false
          })
        }
      } else {
        obj = null
      }
      result.item = obj
      return result
    }

    getMsgContent(content, type) {
      const maxDisplay = 15
      if (type === chatManager.MESSAGE_TYPE_TEXT) {
        const { length } = content
        content = content.replace(/&nbsp;/g, ' ')
        if (length > maxDisplay) {
          content = `${stripNewline(content.substring(0, maxDisplay))}......`
        }
      } else if (type === chatManager.MESSAGE_TYPE_IMAGE) {
        content = '[图片]'
      } else if (type === chatManager.MESSAGE_TYPE_FILE) {
        content = '[文件]'
      } else if (type === chatManager.MESSAGE_TYPE_AUDIO) {
        content = '[语音]'
      }
      return content
    }

    async updateRecent() {
      const user = lkApp.getCurrentUser()
      // const allChat = await chatManager.asyGetAll(user.id)
      const allChat = await chatManager.asyGetAllNew(user.id)
      // const allLastMsg = await chatManager.asyGetAllLastMsg(user.id)
      console.log("allChat:", {allChat})
      const msgAryPromise = []
      let contentAry
      // console.log({allChat})
      const { length } = allChat
      if (length) {
        for (const chat of allChat) {
          const {
            isGroup, name, createTime, chatId, notReadNum, content, type, sendTime, sendName, pic, contactId
          } = chat
          // todo: move to sql
          // const newMsgNum = await chatManager.asyGetNewMsgNum(chatId)
          // console.log({newMsgNum, chatId})
          const option = {
            userId: user.id,
            chatId,
            newMsgNum: notReadNum,
            isGroup,
            chatName: name,
            createTime,
            content,
            type,
            sendTime,
            sendName,
            pic,
            contactId
          }
          // let lastMsg = {}
          // for (const record of allLastMsg) {
          //   const { chatId: lastMsgID} = record
          //   if (chatId === lastMsgID) {
          //     lastMsg = record
          //   }
          // }
          console.log("option getMsg:", option)
          const msgPromise = this.getMsg(option)
          msgAryPromise.push(msgPromise)
        }
        let recentAry = await Promise.all(msgAryPromise)
        recentAry = recentAry.filter(ele => ele.item || ele.isGroup)
        console.log("recentAry:", {recentAry})
        const data = recentAry.map(ele => ele.item)
        const contentArray = []
        for (const react in data) {
          const item = data[react]
          console.log("recent item:", {item})
          const messageItem = <MessageListItem item={item} />
          contentArray.push(messageItem)
        }
        contentAry = contentArray
        // contentAry = <MessageList data={data} />
        console.log("contentAry:", {contentAry})
      } else {
        contentAry = (
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

      this.setState({
        contentAry
      })
      this.resetHeaderTitle()
    }

    chat = debounceFunc((option) => {
      console.log("option:",{option})
      this.props.navigation.navigate('ChatView', option)
    })

    async deleteRow(chatId) {
      await chatManager.asyDeleteChat(this.user.id, chatId)
      this.update()
    }

    resetHeaderTitle = async () => {
      if (container.connectionOK) {
        // console.log('resetHeaderTitle')
        const { navigation } = this.props
        const num = await chatManager.asyGetAllMsgNotReadNum(this.user.id)
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
