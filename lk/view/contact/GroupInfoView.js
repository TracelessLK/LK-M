
import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
const {getAvatarSource} = require('../../util')
const lkApp = require('../../LKApplication').getCurrentApp()
const common = require('@external/common')
const {List} = common
const chatManager = require('../../core/ChatManager')
const {runNetFunc} = require('../../util')

export default class GroupInfoView extends Component<{}> {
  static navigationOptions =() => {
    return {
      headerTitle: '成员信息'
    }
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.group = this.props.navigation.state.params.group
    console.log({group: this.group})
    this.user = lkApp.getCurrentUser()
  }

  render () {
    const dataAry = []
    const {memberInfoObj} = this.group
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
        <View style={{marginVertical: 20}}>
          <List data={dataAry}></List>
          <TouchableOpacity style={{backgroundColor: 'white',
            marginVertical: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12}} onPress={() => {
            runNetFunc(async () => {
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
