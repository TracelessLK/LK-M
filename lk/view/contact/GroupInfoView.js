
import React, { Component } from 'react'
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
const {getAvatarSource} = require('../../util')
const manifest = require('../../../Manifest')
const ChatManager = manifest.get('ChatManager')
const common = require('@external/common')
const {List} = common

export default class GroupInfoView extends Component<{}> {
  static navigationOptions =({ navigation }) => {
    const {group} = navigation.state.params
    const {name} = group
    return {
      headerTitle: '成员信息'
    }
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.group = this.props.navigation.state.params.group
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
      dataAry.push(obj)
    }
    return (
      <View style={{marginVertical: 20}}>
        <List data={dataAry}></List>
      </View>
    )
  }
}
