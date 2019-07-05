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
    }

    sendMessage=() => {
      ChatManager.asyEnsureSingleChat(this.state.chatId)
      this.props.navigation.navigate('ChatTab')
      this.props.navigation.navigate('ChatView', {
        otherSideId: this.state.chatId,
        isGroup: false,
        memberCount: 2,
        avatar: this.state.pic,
        chatName: this.state.chatName
      })
    }

    async componentDidMount () {
      const deviceAry = await ContactManager.asyGetAllDevice(this.state.chatId)
      const str = deviceAry.map(ele => ele.id).join('\n')
      this.setState({
        allDevice: str || '无记录'
      })
      const {contactId} = this.props.navigation.state.params
      const singleContact = await ContactManager.getSingleContact({contactId})
      const {name, pic} = singleContact
      this.setState({
        chatId: contactId,
        chatName: name,
        pic
      })
    }

    subRender () {
      return (
        <ScrollView contentContainerStyle={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', paddingTop: 20}}>
          <Image source={getAvatarSource(this.state.pic)}
            style={{margin: 10, width: 100, height: 100, borderRadius: 5}} resizeMode="contain"/>

          <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '90%', height: 40, marginTop: 20}}>
            <Text>标识：</Text><Text>{this.state.chatId}</Text>
          </View>
          <View style={{width: '90%', height: 0, borderTopWidth: 1, borderColor: '#d0d0d0'}}/>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '90%', height: 40, marginTop: 20}}>
            <Text>昵称：</Text><Text>{this.state.chatName}</Text>
          </View>
          <View style={{width: '90%', height: 0, borderTopWidth: 1, borderColor: '#d0d0d0'}}/>
          <TouchableOpacity onPress={this.sendMessage} style={{marginVertical: 30, width: '90%', height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 18, textAlign: 'center', color: 'gray'}}>发消息</Text>
          </TouchableOpacity>
        </ScrollView>
      )
    }
}
