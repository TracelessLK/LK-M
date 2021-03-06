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

const ChatManager = engine.get('ChatManager')
const ContactManager = engine.get('ContactManager')

export default class FriendInfoView extends ScreenWrapper {
    static navigationOptions =({ navigation }) => {
      const {friend} = navigation.state.params
      return {
        headerTitle: friend.name
      }
    }

    constructor (props) {
      super(props)
      this.state = {}
      this.friend = this.props.navigation.getParam('friend')
    }

    sendMessage=() => {
      ChatManager.asyEnsureSingleChat(this.friend.id)
      this.props.navigation.navigate('ChatTab')
      this.props.navigation.navigate('ChatView', {
        otherSideId: this.friend.id,
        isGroup: false
      })
    }

    async componentDidMount () {
      const deviceAry = await ContactManager.asyGetAllDevice(this.friend.id)
      const str = deviceAry.map(ele => ele.id).join('\n')
      this.setState({
        allDevice: str || '无记录'
      })
    }

    subRender () {
      const friend = this.friend
      return (
        <ScrollView contentContainerStyle={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', paddingTop: 20}}>
          <Image source={getAvatarSource(this.friend.pic)}
            style={{margin: 10, width: 100, height: 100, borderRadius: 5}} resizeMode="contain"/>

          <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '90%', height: 40, marginTop: 20}}>
            <Text>标识：</Text><Text>{friend.id}</Text>
          </View>
          <View style={{width: '90%', height: 0, borderTopWidth: 1, borderColor: '#d0d0d0'}}/>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '90%', height: 40, marginTop: 20}}>
            <Text>昵称：</Text><Text>{friend.name}</Text>
          </View>
          <View style={{width: '90%', height: 0, borderTopWidth: 1, borderColor: '#d0d0d0'}}/>
          <TouchableOpacity onPress={this.sendMessage} style={{marginVertical: 30, width: '90%', height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 5, flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 18, textAlign: 'center', color: 'gray'}}>发消息</Text>
          </TouchableOpacity>
          {/*<View style={{marginVertical: 20}}>*/}
          {/*<Card title='device id'*/}
          {/*style={{marginVertical: 50, width: '95%', padding: 10, alignItems: 'center', justifyContent: 'center'}}>*/}
          {/*<Text>{this.state.allDevice}</Text>*/}
          {/*</Card>*/}
          {/*</View>*/}

        </ScrollView>
      )
    }
}
