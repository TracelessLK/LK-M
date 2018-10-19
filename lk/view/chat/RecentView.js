
import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  NetInfo, RefreshControl
} from 'react-native'
import {
  ActionSheet,
  Icon
} from 'native-base'
const {commonUtil, MessageList} = require('@external/common')
const {debounceFunc} = commonUtil
const {getAvatarSource, addExternalFriend} = require('../../util')
const LKChatProvider = require('../../logic/provider/LKChatProvider')
const LKContactProvider = require('../../logic/provider/LKContactProvider')
const lkApp = require('../../LKApplication').getCurrentApp()
const chatManager = require('../../core/ChatManager')
const _ = require('lodash')
const addPng = require('../image/add.png')
const {NetInfoUtil} = require('@ys/react-native-collection')

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
        connectionOK: true,
        refreshing: false
      }
      this.eventAry = ['msgChanged', 'recentChanged']
      // todo: store all not undefined value
      this.channel = lkApp.getLKWSChannel()
      this.user = lkApp.getCurrentUser()
    }

  optionToChoose = () => {
    const {navigation} = this.props
    let BUTTONS = ['发起群聊', '添加外部好友', '取消']
    let CANCEL_INDEX = BUTTONS.length - 1
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: ''
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          this.props.navigation.navigate('AddGroupView')
        } else if (buttonIndex === 1) {
          addExternalFriend({navigation})
        }
      }
    )
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
    }

    componentDidMount=() => {
      const {navigation} = this.props

      for (let event of this.eventAry) {
        chatManager.on(event, this.update)
      }
      this.updateRecent()
      navigation.setParams({optionToChoose: this.optionToChoose})

      this.channel.on('connectionFail', this.connectionFail.bind(this))
      this.channel.on('connectionOpen', this.connectionOpen.bind(this))
    }

    connectionFail () {
      const {navigation} = this.props
      navigation.setParams({
        headerTitle: '消息(未连接)'
      })
      if (NetInfoUtil.online) {
        this.setState({
          connectionOK: false,
          msg: '与服务器的连接已断开',
          type: 'connectionFail'
        })
      } else {
        this.setState({
          connectionOK: false,
          msg: '当前网络不可用,请检查您的网络设置',
          type: 'networkFail'
        })
      }
    }
    connectionOpen () {
      this.resetHeaderTitle()
      this.setState({
        connectionOK: true
      })
    }

    async getMsg (option) {
      const {userId, chatId, newMsgNum, isGroup, chatName, createTime} = option
      let result = {
        isGroup
      }
      const msgAry = await LKChatProvider.asyGetMsgs(userId, chatId)
      // console.log({msgAry})
      // console.log({createTime})
      const {length} = msgAry
      if (isGroup) {
        let obj = {}
        obj.id = chatId
        obj.name = chatName
        obj.newMsgNum = newMsgNum
        if (length) {
          const lastMsg = _.last(msgAry)
          obj.content = lastMsg.content
          obj.time = new Date(lastMsg.sendTime)
        } else {
          obj.content = '一起群聊吧'
          obj.time = new Date(createTime)
        }

        const memberAry = await LKChatProvider.asyGetGroupMembers(chatId)
        // console.log({memberAry})
        const memberInfoObj = memberAry.reduce((accumulator, ele) => {
          accumulator[ele.id] = ele
          return accumulator
        }, {})
        // console.log({memberInfoObj})
        const picAry = memberAry.map(ele => ele.pic)
        obj.image = picAry
        obj.onPress = () => {
          const param = {
            isGroup: true,
            otherSide: {
              id: chatId,
              memberInfoObj,
              name: chatName
            }
          }
          this.chat(param)
        }
        // console.log({picAry})
        result.item = obj
      } else if (length) {
        const obj = {}
        const msg = _.last(msgAry)
        const {sendTime, content} = msg
        const person = await LKContactProvider.asyGet(userId, chatId)
        const {name, pic} = person
        obj.time = new Date(sendTime)
        obj.content = content
        obj.sendTime = sendTime
        obj.newMsgNum = newMsgNum
        obj.name = name
        obj.person = person
        obj.id = chatId
        obj.image = getAvatarSource(pic)

        obj.onPress = () => {
          this.chat({
            otherSide: person,
            isGroup: false
          })
        }
        obj.deletePress = () => {
          this.deleteRow(chatId)
        }
        result.item = obj
      }

      return result
    }

    async updateRecent () {
      const user = lkApp.getCurrentUser()
      const allChat = await LKChatProvider.asyGetAll(user.id)
      const msgAryPromise = []
      let contentAry
      console.log({allChat})
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
        // console.log({data})
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
      await LKChatProvider.asyDeleteChat(this.user.id, chatId)
      this.update()
    }

    resetHeaderTitle = async () => {
      if (this.state.connectionOK) {
        const {navigation} = this.props
        const num = await LKChatProvider.asyGetAllMsgNotReadNum(this.user.id)
        navigation.setParams({
          headerTitle: '消息' + (num ? `(${num})` : '')
        })
      }
    }

    render () {
      const {navigation} = this.props
      return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff'}}>
          {this.state.connectionOK ? null
            : <TouchableOpacity style={{height: 40, backgroundColor: '#ffe3e0', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}
              onPress={() => { this.props.navigation.navigate('ConnectionFailView', {type: this.state.type}) }}
            >
              <Icon name='ios-alert' style={{color: '#eb7265', fontSize: 25, marginRight: 5}}/><Text style={{color: '#606060'}}>{this.state.msg}</Text>
            </TouchableOpacity>
          }
          <ScrollView style={{width: '100%', paddingTop: 10}} keyboardShouldPersistTaps="always"
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={async () => {
                  this.setState({
                    refreshing: true
                  })
                  navigation.setParams({
                    headerTitle: '消息(正在接受消息...)'
                  })
                  const minTime = 1000 * 1
                  const start = Date.now()
                  await this.channel.asyGetAllDetainedMsg()
                  const reset = () => {
                    this.resetHeaderTitle()
                    this.setState({
                      refreshing: false
                    })
                  }
                  let diff = minTime - (Date.now() - start)
                  diff = diff > 0 ? diff : 0
                  setTimeout(reset, diff)
                }}
              />}
          >
            {this.state.contentAry}
          </ScrollView>
        </View>
      )
    }
}
