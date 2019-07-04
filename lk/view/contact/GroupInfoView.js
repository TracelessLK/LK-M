
import React, { Component } from 'react'
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native'
import {ListItem} from "react-native-elements"

const {getAvatarSource} = require('../../util')
const {engine} = require('@lk/LK-C')

const common = require('@external/common')
const uuid = require('uuid')

const {List} = common
const chatManager = engine.ChatManager
const {runNetFunc} = require('../../util')
const addPng = require('../image/add.png')

export default class GroupInfoView extends Component<{}> {
  static navigationOptions =({navigation}) => {
    const size = 20
    return {
      headerTitle: '成员信息',
      headerRight:
  <TouchableOpacity onPress={navigation.getParam('addMember')}>
    <Image source={addPng} style={{width: size, height: size, marginHorizontal: 10}} resizeMode='contain'/>
  </TouchableOpacity>
    }
  }

  constructor (props) {
    super(props)
    const { chatName, chatId } = this.props.navigation.state.params
    this.chatName = chatName
    this.chatId = chatId
    this.state = {}

    this.asyncRender()
  }

  componentDidMount () {
    this.asyncRender()
    const {navigation} = this.props
    navigation.setParams({addMember: () => {
      navigation.navigate('AddGroupMemberView', {
        chatId: this.chatId,
        chatName: this.chatName
      })
    }})
    chatManager.on('groupMemberChange', this.groupMemberChange)
  }

  groupMemberChange = async ({param}) => {
    const {chatId} = param
    if (chatId === this.group.id) {
      this.setState({
        update: true
      })
      this.asyncRender(chatId)
    }
  }

  async asyncRender () {
    const memberAry = await chatManager.getAllGroupMember({chatId: this.chatId})
    const dataAry = []
    for (let value of memberAry) {
      const {contactId, name, pic} = value
      const obj = {
        image: getAvatarSource(pic),
        // key: contactId,
        key: uuid(),
        title: name
      }
      obj.title = name
      dataAry.push(obj)
    }

    const {navigation} = this.props
    const list = [
      {
        title: '群聊名称',
        onPress: () => {
          navigation.navigate('GroupRenameView', {
            id: this.chatId,
            name: this.chatName
          })
        }

      }
    ]
    const style = {
      listStyle: {
        backgroundColor: 'white', marginVertical: 10
      }
    }
    const content = (
      <View style={{marginBottom: 20}}>
        <View style={style.listStyle}>
          {
              list.map((item, i) => (
                <ListItem
                  key={i}
                  title={item.title}
                  component={item.label}
                  rightIcon={item.rightIconColor ? { style: { color: item.rightIconColor } } : {}}
                  onPress={item.onPress}
                  />
              ))
            }
        </View>
        <List data={dataAry}></List>
        <TouchableOpacity style={{backgroundColor: 'white',
          marginVertical: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12}} onPress={() => {
            runNetFunc(async () => {
              this.setState({
                isWating: true
              })
              await chatManager.leaveGroup(this.group.id)
              this.props.navigation.navigate('RecentView')
            })
          }}>
          <Text style={{fontSize: 17, color: '#e53d59'}} >退出群聊</Text>
        </TouchableOpacity>
      </View>
    )
    this.setState({
      content
    })
  }

  componentWillUnmount () {
    chatManager.un('groupMemberChange', this.groupMemberChange)
  }

  render () {
    return (
      <ScrollView>
        {this.state.isWating ? <ActivityIndicator size='large' style={{position: 'absolute', top: '50%'}}/> : null}
        {this.state.content}
      </ScrollView>

    )
  }
}
