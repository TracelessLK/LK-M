import React, { Component} from 'react'
import {Button, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native'
const common = require('@external/common')
const {List} = common
const {FuncUtil} = require('@ys/vanilla')
const {debounceFunc} = FuncUtil
const lkApp = require('../../LKApplication').getCurrentApp()
const LKContactProvider = require('../../logic/provider/LKContactProvider')
const {getAvatarSource} = require('../../util')
const _ = require('lodash')
const chatManager = require('../../core/ChatManager')
const {runNetFunc} = require('../../util')

export default class AddGroupMemberView extends Component<{}> {
  static navigationOptions =({ navigation }) => (
    {
      headerTitle: '添加群成员',
      headerRight:
        <TouchableOpacity style={{marginRight: 20}}>
          <Button color="#fff" title="确定"
            onPress={debounceFunc(() => {
              navigation.state.params.navigateAddGroupPress()
            })}
            style={{marginRight: 20}}/>
        </TouchableOpacity>
    }
  )

  constructor (props) {
    super(props)
    this.state = {
      contentAry: []
    }
    this.group = this.props.navigation.state.params.group
    // console.log({group: this.group})
    this.selectedAry = []
    this.user = lkApp.getCurrentUser()
  }

  createGroup= () => {
    runNetFunc(async () => {
      if (this.selectedAry.length === 0) {
        alert('请选择需要新增群成员')
      } else {
        // console.log({selectedAry: this.selectedAry, user: this.user})
        await chatManager.newGroupChat(this.name, [this.user].concat(this.selectedAry))
        this.props.navigation.goBack()
      }
    })
  }

  async asyncRender (filterText) {
    const memberIdAry = Object.keys(this.group.memberInfoObj)
    console.log({memberIdAry})
    const user = lkApp.getCurrentUser()
    const sortFunc = (ele1, ele2) => {
      const result = (ele2.title < ele1.title)

      return result
    }
    let dataAry = []

    const _f = (item, content, ary) => {
      if (filterText) {
        if (item.name.includes(filterText)) {
          ary.push(content)
        }
      } else {
        ary.push(content)
      }
    }
    let ary = []

    let memberAry = await LKContactProvider.asyGetAllMembers(user.id)
    memberAry = memberAry.filter(ele => {
      return !memberIdAry.includes(ele.id)
    })
    for (let ele of memberAry) {
      if (ele.id !== user.id) {
        const obj = {}
        obj.image = getAvatarSource(ele.pic)
        obj.key = ele.id
        obj.onPress = null
        obj.title = ele.name
        obj.extra = {
          id: ele.id,
          name: ele.name,
          pic: ele.pic,
          serverIP: user.serverIP,
          serverPort: user.serverPort
        }
        _f(ele, obj, ary)
      }
    }

    let friendAry = await LKContactProvider.asyGetAllFriends(user.id)
    friendAry = friendAry.filter(ele => {
      return !memberIdAry.includes(ele.id)
    })
    // console.log({memberAry, friendAry})

    for (let ele of friendAry) {
      const obj = {}
      obj.onPress = null
      obj.title = ele.name
      obj.image = getAvatarSource(ele.pic)
      obj.key = ele.id
      obj.extra = {
        id: ele.id,
        name: ele.name,
        pic: ele.pic,
        serverIP: ele.serverIP,
        serverPort: ele.serverPort
      }
      _f(ele, obj, ary)
    }

    ary.sort(sortFunc)
    dataAry = dataAry.concat(ary)
    let contentAry = <List data={dataAry} showSwitch onSelectedChange={this.onSelectedChange}></List>
    if (!dataAry.length) {
      contentAry =
        <View style={{justifyContent: 'center'}}>
          <Text>所有的好友都已经加入本群</Text>
        </View>
    }
    this.setState({
      contentAry
    })
  }

  onSelectedChange = (selectedObj) => {
    this.selectedAry = _.values(selectedObj)
  }

  componentDidMount () {
    this.props.navigation.setParams({ navigateAddGroupPress: this.createGroup })

    this.asyncRender()
  }
  render () {
    return (
      <ScrollView>
        <View style={{marginVertical: 20}}>
          {this.state.contentAry}
        </View>

      </ScrollView>
    )
  }
}
