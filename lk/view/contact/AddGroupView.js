import React, { Component} from 'react'
import {
  ActivityIndicator,
  Button, ScrollView, Text,
  TextInput,
  TouchableOpacity, View, Platform
} from 'react-native'
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

export default class AddGroupView extends Component<{}> {
  static navigationOptions =({ navigation }) => {
    return (
      {
        headerRight:
          <TouchableOpacity style={{marginRight: 20}}>
            <Button title="确定" color = {Platform.OS === 'ios' ? '#fff' : null}
              onPress={debounceFunc(() => {
                navigation.state.params.navigateAddGroupPress()
              })}
              style={{marginRight: 20, color: '#fff'}}/>
          </TouchableOpacity>
      }
    )
  }

  constructor (props) {
    super(props)
    this.state = {
      contentAry: []
    }
    this.selectedAry = []
    this.user = lkApp.getCurrentUser()
  }

  nameTextChange=(v) => {
    this.name = v
  }

  createGroup= () => {
    runNetFunc(async () => {
      if (!this.name) {
        alert('请填写群名称')
        return
      }
      if (this.selectedAry.length === 0) {
        alert('请选择群成员')
      } else {
        // console.log({selectedAry: this.selectedAry, user: this.user})
        // todo: disable button and timeout
        this.setState({
          isWating: true
        })
        await chatManager.newGroupChat(this.name, [this.user].concat(this.selectedAry))
        this.props.navigation.goBack()
      }
    })
  }

  async asyncRender (filterText) {
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

    const memberAry = await ContactManager.asyGetAllMembers(user.id)
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

    const friendAry = await ContactManager.asyGetAllFriends(user.id)
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

    this.setState({
      contentAry: (
        <List data={dataAry} showSwitch onSelectedChange={this.onSelectedChange}></List>
      )
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
    // fixme: autofocus
    // java.lang.IndexOutOfBoundsException: charAt: -1 < 0
    //         at android.text.SpannableStringBuilder.charAt(SpannableStringBuilder.java:121)
    return (
      <ScrollView>
        {this.state.isWating ? <ActivityIndicator size='large' style={{position: 'absolute', top: '50%'}}/> : null}
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '96%', height: 40, marginTop: 10, marginLeft: 10}}>
            <Text style={{color: '#a0a0a0'}}>群名称：</Text>
            <TextInput  style={{flex: 1}} underlineColorAndroid='transparent' defaultValue={''} onChangeText={this.nameTextChange} />
          </View>
          <View style={{width: '100%', height: 0, borderTopWidth: 1, borderColor: '#f0f0f0'}}>
          </View>
        </View>
        {this.state.contentAry}
      </ScrollView>
    )
  }
}
