
import React, { Component } from 'react'
import {
  View
} from 'react-native'
const {getAvatarSource} = require('../../util')
const lkApp = require('../../LKApplication').getCurrentApp()
const common = require('@external/common')
const {List} = common

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
      <View style={{marginVertical: 20}}>
        <List data={dataAry}></List>
      </View>
    )
  }
}
