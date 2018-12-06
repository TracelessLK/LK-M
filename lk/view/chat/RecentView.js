
import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  RefreshControl,
  AppState
} from 'react-native'
import NetIndicator from '../common/NetIndicator'
const {commonUtil, MessageList, PushUtil} = require('@external/common')
const {removeNotify} = PushUtil
const {debounceFunc} = commonUtil
const {getAvatarSource, addExternalFriend} = require('../../util')
const {engine} = require('@lk/LK-C')

const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()
const chatManager = require('../../manager/LKChatManager')
const ContactManager = engine.get('ContactManager')
const _ = require('lodash')
const addPng = require('../image/add.png')
const {NetInfoUtil} = require('@ys/react-native-collection')
const container = require('../../state')
container.NetInfoUtil = NetInfoUtil
const {runNetFunc} = require('../../util')
const {StringUtil} = require('@ys/vanilla')
const {stripNewline} = StringUtil

export default class RecentView extends Component<{}> {
    static navigationOptions =({navigation}) => {
      const size = 20
      let headerTitle = navigation.getParam('headerTitle')
      headerTitle = headerTitle || '消息'
      return {
        headerTitle,
        headerRight:
        <TouchableOpacity onPress={navigation.getParam('optionToChoose')}>
          <Image source={addPng} style={{width: size, height: size, marginHorizontal: 10}} resizeMode='contain'/>
        </TouchableOpacity>
      }
    }
    constructor (props) {
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
        console.log({onNotfication: res})
        const {_data, _alert} = res
        if (_data) {
          const {type} = _data
          if (type === 'notify') {
            this.props.navigation.navigate('NotifyView', {
              msg: _alert
            })
          }
        }
      }
      new PushUtil({
        onNotfication: res => {
          checkNotify(res)
        },
        onInitialNotification: res => {
          if (res) {
            checkNotify(res)
            const {_data: data} = res
            const {senderId, chatId, isGroup} = data
            console.log({onInitialNotification: res})
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
      for (let event of this.eventAry) {
        chatManager.un(event, this.update)
      }
      this.channel.un('connectionFail', this.connectionFail)
      this.channel.un('connectionOpen', this.connectionOpen)
      AppState.removeEventListener('change', this._handleAppStateChange)
    }

    componentDidMount=() => {
      const {navigation} = this.props

      for (let event of this.eventAry) {
        chatManager.on(event, this.update)
      }
      this.updateRecent()
      navigation.setParams({optionToChoose: this.optionToChoose})

      this.channel.on('connectionFail', this.connectionFail)
      this.channel.on('connectionOpen', this.connectionOpen)
      AppState.addEventListener('change', this._handleAppStateChange)
    }

    _handleAppStateChange = (appState) => {
      // console.log({appState})
      if (appState === 'active') {
        this.asyGetAllDetainedMsg({minTime: 500})
        removeNotify()
      }
    }

    connectionFail = () => {
      const {navigation} = this.props
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

    getConnectionMsg () {
      let result
      if (NetInfoUtil.online) {
        result = '与服务器的连接已断开'
      } else {
        result = '当前网络不可用,请检查您的网络设置'
      }
      return result
    }

    connectionOpen = () => {
      this.asyGetAllDetainedMsg()
      this.resetHeaderTitle()
    }

    async getMsg (option) {
      const {userId, chatId, newMsgNum, isGroup, chatName, createTime} = option
      let result = {
        isGroup
      }
      const msgAry = await chatManager.asyGetMsgs(userId, chatId)
      // console.log({msgAry})
      // console.log({createTime})
      const {length} = msgAry
      let obj = {
        deletePress: () => {
          this.deleteRow(chatId)
        }
      }

      if (isGroup) {
        obj.id = chatId
        obj.name = chatName
        obj.newMsgNum = newMsgNum
        if (length) {
          const lastMsg = _.last(msgAry)
          obj.content = this.getMsgContent(lastMsg.content, lastMsg.type)
          obj.time = new Date(lastMsg.sendTime)
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
        // console.log({picAry})
      } else if (length) {
        const msg = _.last(msgAry)
        const {sendTime, content, type} = msg
        const person = await ContactManager.asyGet(userId, chatId)
        const {name, pic} = person
        obj.time = new Date(sendTime)
        obj.content = this.getMsgContent(content, type)
        obj.sendTime = sendTime
        obj.newMsgNum = newMsgNum
        obj.name = name
        obj.person = person
        obj.id = chatId
        obj.image = getAvatarSource(pic)

        obj.onPress = () => {
          this.chat({
            otherSideId: person.id,
            isGroup: false
          })
        }
      } else {
        obj = null
      }
      result.item = obj
      return result
    }

    getMsgContent (content, type) {
      // console.log({content})
      const maxDisplay = 15
      if (type === chatManager.MESSAGE_TYPE_TEXT) {
        const {length} = content
        // console.log({content,length})
        if (length > maxDisplay) {
          content = stripNewline(content.substring(0, maxDisplay)) + '......'
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
    async updateRecent () {
      const user = lkApp.getCurrentUser()
      const allChat = await chatManager.asyGetAll(user.id)
      const msgAryPromise = []
      let contentAry
      // console.log({allChat})
      const {length} = allChat
      if (length) {
        for (let chat of allChat) {
          const {isGroup, name, createTime, id: chatId} = chat
          const newMsgNum = await chatManager.asyGetNewMsgNum(chatId)
          // console.log({newMsgNum, chatId})
          const option = {
            userId: user.id,
            chatId,
            newMsgNum,
            isGroup,
            chatName: name,
            createTime
          }
          const msgPromise = this.getMsg(option)
          msgAryPromise.push(msgPromise)
        }
        let recentAry = await Promise.all(msgAryPromise)
        recentAry = recentAry.filter(ele => {
          return ele.item || ele.isGroup
        })

        // recentAry.sort((obj1, obj2) => {
        //   return obj1.sendTime - obj2.sendTime
        // })
        const data = recentAry.map(ele => ele.item)
        // console.log({data, recentAry})
        contentAry = <MessageList data={data}/>
      } else {
        contentAry =
          <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('ContactTab') }} style={{marginTop: 30, width: '90%', height: 50, borderColor: 'gray', borderWidth: 1, borderRadius: 5, flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 18, textAlign: 'center', color: 'gray'}}>开始和好友聊天吧!</Text>
            </TouchableOpacity>
          </View>
      }

      this.setState({
        contentAry
      })
      this.resetHeaderTitle()
    }

    chat = debounceFunc((option) => {
      this.props.navigation.navigate('ChatView', option)
    })

    async deleteRow (chatId) {
      await chatManager.asyDeleteChat(this.user.id, chatId)
      this.update()
    }

    resetHeaderTitle = async () => {
      if (container.connectionOK) {
        // console.log('resetHeaderTitle')
        const {navigation} = this.props
        const num = await chatManager.asyGetAllMsgNotReadNum(this.user.id)
        navigation.setParams({
          headerTitle: '消息' + (num ? `(${num})` : '')
        })
      }
    }

  asyGetAllDetainedMsg = (option = {}) => {
    const {minTime = 0, refreshControl, showWarning = false} = option
    const {navigation} = this.props

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
    }, {showWarning})
  }

  render () {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff'}}>
        <NetIndicator/>
        <ScrollView style={{width: '100%', paddingTop: 10}} keyboardShouldPersistTaps="always"
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.asyGetAllDetainedMsg({refreshControl: true, showWarning: true, minTime: 1000})
              }}
            />}
        >
          {this.state.contentAry}
        </ScrollView>
      </View>
    )
  }
}
