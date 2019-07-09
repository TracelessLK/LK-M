import React, { Component} from 'react'
import {Button, ScrollView, TouchableOpacity, View, Platform} from 'react-native'

const common = require('@external/common')

const {List} = common
const {FuncUtil} = require('@ys/vanilla')

const {debounceFunc} = FuncUtil
const {engine} = require('@lk/LK-C')

const Application = engine.Application
const lkApp = Application.getCurrentApp()

const {getAvatarSource} = require('../../util')
const _ = require('lodash')

const chatManager = engine.ChatManager
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
    const {chatId, chatName} = this.props.navigation.state.params
    this.chatId = chatId
    this.chatName = chatName
    this.selectedAry = []
    this.user = lkApp.getCurrentUser()
  }

  createGroup= () => {
    runNetFunc(async () => {
      if (this.selectedAry.length === 0) {
        alert('请选择需要新增群成员')
      } else {
        await chatManager.newGroupMembers(this.chatId, this.chatName, this.selectedAry)
        this.props.navigation.goBack()
      }
    })
  }

  async asyncRender () {
    const {navigation} = this.props
    const memberAry = await chatManager.getNonGroupMember({
      chatId: this.chatId
    })
    const dataAry = []

    for (const ele of memberAry) {
      const obj = {}
      obj.image = getAvatarSource(ele.pic)
      obj.key = ele.id
      obj.onPress = null
      obj.title = ele.name
      dataAry.push(obj)
    }


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
