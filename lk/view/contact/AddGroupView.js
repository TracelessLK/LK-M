import React, { Component} from 'react'
import {Button, Image, ScrollView, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native'
const common = require('@external/common')
const {List} = common
const {FuncUtil} = require('@ys/vanilla')
const {debounceFunc} = FuncUtil
const lkApp = require('../../LKApplication').getCurrentApp()
const LKContactProvider = require('../../logic/provider/LKContactProvider')
const {getAvatarSource} = require('../../util')

export default class AddGroupView extends Component<{}> {
  static navigationOptions =({ navigation }) => (
    {
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
    this.selectedAry = []
  }

  nameTextChange=(v) => {
    this.name = v
  }

  createGroup=() => {
    if (!this.name) {
      alert('请填写群名称')
      return
    }
    if (this.selectedAry.length === 0) {
      alert('请选择群成员')
    } else {
      console.log({name:this.name, ary:this.selectedAry})
    }
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

    const memberAry = await LKContactProvider.asyGetAllMembers(user.id)

    for (let ele of memberAry) {
      if (ele.id !== user.id) {
        const obj = {}

        obj.image = getAvatarSource(ele.pic)
        obj.key = ele.id
        obj.onPress = null
        obj.title = ele.name
        _f(ele, obj, ary)
      }
    }

    const friendAry = await LKContactProvider.asyGetAllFriends(user.id)
    for (let ele of friendAry) {
      const obj = {}
      obj.onPress = null
      obj.title = ele.name
      obj.image = getAvatarSource(ele.pic)
      obj.key = ele.id
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

  onSelectedChange = (selectedAry) => {
    this.selectedAry = selectedAry
  }

  componentDidMount () {
    this.props.navigation.setParams({ navigateAddGroupPress: this.createGroup })

    this.asyncRender()
  }
  render () {
    return (
      <ScrollView>
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '96%', height: 40, marginTop: 10, marginLeft: 10}}>
            <Text style={{color: '#a0a0a0'}}>群名称：</Text>
            <TextInput style={{flex: 1}} underlineColorAndroid='transparent' defaultValue={''} onChangeText={this.nameTextChange} />
          </View>
          <View style={{width: '100%', height: 0, borderTopWidth: 1, borderColor: '#f0f0f0'}}>
          </View>
        </View>
        {this.state.contentAry}
      </ScrollView>
    )
  }
}
