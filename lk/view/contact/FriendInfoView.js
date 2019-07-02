import React from 'react'
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native'
import {
} from 'native-base'
import ScreenWrapper from "../common/ScreenWrapper"

const {getAvatarSource} = require('../../util')
const {engine} = require('@lk/LK-C')

const ChatManager = engine.ChatManager
const ContactManager = engine.ContactManager

export default class FriendInfoView extends ScreenWrapper {
    static navigationOptions =({ navigation }) => {
      const {chatName} = navigation.state.params
      return {
        headerTitle: chatName
      }
    }

    constructor (props) {
      super(props)
      this.state = {}
      const {chatId, chatName, imageAry} = this.props.navigation.state.params
      this.chatId = chatId
      this.chatName = chatName
      this.pic = imageAry[0]
    }

    sendMessage=() => {
      ChatManager.asyEnsureSingleChat(this.chatId)
      this.props.navigation.navigate('ChatTab')
      this.props.navigation.navigate('ChatView', {
        otherSideId: this.chatId,
        isGroup: false
      })
    }

    async componentDidMount () {
      const deviceAry = await ContactManager.asyGetAllDevice(this.chatId)
      const str = deviceAry.map(ele => ele.id).join('\n')
      this.setState({
        allDevice: str || '无记录'
      })
    }

    subRender () {
      return (
        <ScrollView contentContainerStyle={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', paddingTop: 20}}>
          <Image source={getAvatarSource(this.pic)}
            style={{margin: 10, width: 100, height: 100, borderRadius: 5}} resizeMode="contain"/>

          <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '90%', height: 40, marginTop: 20}}>
            <Text>标识：</Text><Text>{this.chatId}</Text>
          </View>
          <View style={{width: '90%', height: 0, borderTopWidth: 1, borderColor: '#d0d0d0'}}/>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '90%', height: 40, marginTop: 20}}>
            <Text>昵称：</Text><Text>{this.chatName}</Text>
          </View>
          <View style={{width: '90%', height: 0, borderTopWidth: 1, borderColor: '#d0d0d0'}}/>
          <TouchableOpacity onPress={this.sendMessage} style={{marginVertical: 30, width: '90%', height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 18, textAlign: 'center', color: 'gray'}}>发消息</Text>
          </TouchableOpacity>
        </ScrollView>
      )
    }
}
