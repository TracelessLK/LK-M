
import React, { Component } from 'react'
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity
} from 'react-native'
import {ActionSheet} from 'native-base'
const {commonUtil, MessageList} = require('@external/common')
const {debounceFunc} = commonUtil
const {getAvatarSource} = require('../../util')
const LKChatProvider = require('../../logic/provider/LKChatProvider')
const LKContactProvider = require('../../logic/provider/LKContactProvider')
const lkApp = require('../../LKApplication').getCurrentApp()
const chatManager = require('../../core/ChatManager')
const _ = require('lodash')
const addPng = require('../image/add.png')

export default class RecentView extends Component<{}> {
    static navigationOptions =({navigation}) => {
      const size = 20
      return {
        headerTitle: '消息',
        headerRight:
        <TouchableOpacity onPress={navigation.getParam('optionToChoose')}>
          <Image source={addPng} style={{width: size, height: size, marginHorizontal: 10}} resizeMode='contain'/>
        </TouchableOpacity>
      }
    }
    constructor (props) {
      super(props)
      this.state = {
        contentAry: null
      }
      this.eventAry = ['msgChanged', 'recentChanged']
    }

  optionToChoose = () => {
    let BUTTONS = ['发起群聊', '添加好友', '取消']
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
    }
    componentDidMount=() => {
      for (let event of this.eventAry) {
        chatManager.on(event, this.update)
      }
      this.updateRecent()
      this.props.navigation.setParams({optionToChoose: this.optionToChoose})
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
        const memberInfoObj = {}
        for (let ele of memberAry) {
          memberInfoObj[ele.id] = ele
        }
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
      console.log({allChat})
      for (let chat of allChat) {
        const {isGroup, name, createTime} = chat
        const option = {
          userId: user.id,
          chatId: chat.id,
          newMsgNum: await chatManager.asyGetNewMsgNum(chat.id),
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

      const contentAry = <MessageList data={recentAry.map(ele => ele.item)}/>

      this.setState({
        contentAry
      })
    }

    chat = debounceFunc((option) => {
      this.props.navigation.navigate('ChatView', option)
    })

    deleteRow (data) {
      // Store.deleteRecent(data.id,()=>{
      //     this.update()
      // })
    }

    render () {
      return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff'}}>
          {/* <TouchableOpacity onPress={()=>{this.props.navigation.navigate('ContactTab')}} style={{marginTop:30,width:"90%",height:50,borderColor:"gray",borderWidth:1,borderRadius:5,flex:0,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}> */}
          {/* <Text style={{fontSize:18,textAlign:"center",color:"gray"}}>开始和好友聊天吧!</Text> */}
          {/* </TouchableOpacity> */}
          <ScrollView style={{width: '100%', paddingTop: 10}} keyboardShouldPersistTaps="always">
            {this.state.contentAry}
          </ScrollView>
        </View>
      )
    }
}
