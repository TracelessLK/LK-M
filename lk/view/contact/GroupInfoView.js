
import React, { Component } from 'react'
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native'
const {getAvatarSource} = require('../../util')
const {engine} = require('@lk/LK-C')

const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()
const common = require('@external/common')
const {List} = common
const chatManager = engine.get('ChatManager')
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
    this.state = {
      groups:[]
    }
    this.group = this.props.navigation.state.params.group
    // console.log({group: this.group})
    this.user = lkApp.getCurrentUser()
    this.asyncRender(this.group.id)
  }

  componentDidMount () {
    const {navigation} = this.props
    navigation.setParams({addMember: () => {
        navigation.navigate('AddGroupMemberView', {group: this.state.groups})
      }})
    chatManager.on('groupMemberChange', this.groupMemberChange)
  }

  groupMemberChange = async (chatId) => {
    if (chatId === this.group.id) {
      this.setState({
        update: true
      })
    }
    this.asyncRender(chatId)
  }
  async asyncRender (filterText) {
    const chat = await chatManager.asyGetChat(this.user.id, filterText)
    let headerTitle = chat.name
    const memberAry = await chatManager.asyGetGroupMembers(filterText)
    let memberInfoObj = memberAry.reduce((accumulator, ele) => {
      accumulator[ele.id] = ele
      return accumulator
    }, {})
    let o = {
      memberInfoObj,
      id: filterText,
      name: headerTitle
    }
    this.setState({
      groups: o
    })
  }
  componentWillUnmount () {
    chatManager.un('groupMemberChange', this.groupMemberChange)
  }

  render () {
    const state = this.state
    const {memberInfoObj} = state.groups
    const dataAry = []
    for (let key in memberInfoObj) {
      const value = memberInfoObj[key]
      const {id, name, pic} = value
      const obj = {
        image: getAvatarSource(pic),
        key: id,
        title: name
      }
      if (id === this.user.id) {
        obj.title = name + ' (我) '
      } else {
        obj.title = name
      }
      dataAry.push(obj)
    }
    return (
        <ScrollView>
          {this.state.isWating ? <ActivityIndicator size='large' style={{position: 'absolute', top: '50%'}}/> : null}
          <View style={{marginVertical: 20}}>
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
                this.props.navigation.navigate('RecentTab')
              })
            }}>
              <Text style={{fontSize: 17, color: '#e53d59'}} >退出群聊</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

    )
  }
}
