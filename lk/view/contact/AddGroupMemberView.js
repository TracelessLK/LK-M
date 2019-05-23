import React, { Component} from 'react'
import {Button, ScrollView, TouchableOpacity, View, Platform} from 'react-native'

const common = require('@external/common')

const {List} = common
const {FuncUtil} = require('@ys/vanilla')

const {debounceFunc} = FuncUtil
const {engine} = require('@lk/LK-C')

const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()

const {getAvatarSource} = require('../../util')
const _ = require('lodash')

const chatManager = engine.get('ChatManager')
const ContactManager = engine.get('ContactManager')
const {runNetFunc} = require('../../util')
const {CenterLayout} = require('@ys/react-native-collection')
const style = require('../style')
const noUserImg = require('../image/noUser.png')

export default class AddGroupMemberView extends Component<{}> {
  static navigationOptions =({ navigation }) => {
    const {params} = navigation.state
    const {hasOneToAdd} = params
    const headerRight = hasOneToAdd ? (
      <TouchableOpacity style={{marginRight: 20}}>
        <Button title="确定" color={Platform.OS === 'ios' ? '#fff' : false}
          onPress={debounceFunc(() => {
            params.navigateAddGroupPress()
          })}
          style={{marginRight: 20}}/>
      </TouchableOpacity>
    ) : null

    return {
      headerTitle: '添加群成员',
      headerRight

    }
  }

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
        // console.log({selectedAry: this.selectedAry})
        await chatManager.newGroupMembers(this.group.id, this.group.name, this.selectedAry)
        this.props.navigation.goBack()
      }
    })
  }

  async asyncRender (filterText) {
    const {navigation} = this.props
    const memberIdAry = Object.keys(this.group.memberInfoObj)
    // console.log({memberIdAry})
    const user = lkApp.getCurrentUser()
    const sortFunc = (ele1, ele2) => {
      const result = ele2.title < ele1.title

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
    const ary = []

    let memberAry = await ContactManager.asyGetAllMembers(user.id)
    memberAry = memberAry.filter(ele => {
      return !memberIdAry.includes(ele.id)
    })
    for (const ele of memberAry) {
      if (ele) {
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
    }

    let friendAry = await ContactManager.asyGetAllFriends(user.id)
    friendAry = friendAry.filter(ele => {
      return !memberIdAry.includes(ele.id)
    })
    // console.log({memberAry, friendAry})

    for (const ele of friendAry) {
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
      const prop = {
        text: '所有的好友都已经加入本群',
        textStyle: {color: style.color.secondColor},
        img: noUserImg
      }
      const noContent = <CenterLayout {...prop}></CenterLayout>
      contentAry = noContent
    } else {
      navigation.setParams({hasOneToAdd: true})
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
