import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  BackHandler
} from 'react-native'
import ScreenWrapper from '../common/ScreenWrapper'
const common = require('@external/common')
const {SearchBar, commonUtil, List} = common
const {debounceFunc} = commonUtil
const {engine} = require('@lk/LK-C')
const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()
const ContactManager = engine.get('ContactManager')
const UserManager = engine.get('UserManager')
const OrgManager = engine.get('OrgManager')
const {getAvatarSource} = require('../../util')
const style = require('../style')

export default class ContactView extends ScreenWrapper {
    static navigationOptions =() => {
      return {
        headerTitle: '通讯录'
      }
    }

    constructor (props) {
      super(props)
      this.props.navigation.setParams({
        ContactView: this
      })
      this.eventAry = []
      this.state = {
        contentAry: []
      }
    }

    componentDidMount () {
      // for(let event of this.eventAry){
      //     ContactManager.on(event,this.update);
      // }
        ContactManager.on('contactChanged', this.update)
      this.asyncRender()
    }

    componentWillUnmount =() => {
      // for(let event of this.eventAry){
      //     ContactManager.un(event,this.update);
      // }
        ContactManager.un('contactChanged', this.update)
    }

    onBackPress = () => {
        BackHandler.exitApp()
    }

    update = () => {
        this.asyncRender()
    }

    go2FriendInfoView=debounceFunc((f) => {
      this.props.navigation.navigate('FriendInfoView', {friend: f})
    })

    go2OrgView = debounceFunc((org) => {
      this.props.navigation.navigate('OrgView', {org})
    })

    async asyncRender (filterText) {
      const user = lkApp.getCurrentUser()
      let orgAry = await OrgManager.asyGetChildren(null, user.id)
      // console.log({orgAry})
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
      for (let ele of orgAry) {
        const obj = {}
        obj.onPress = () => {
          this.go2OrgView(ele)
        }
        obj.title = ele.name
        obj.image = require('../image/folder.png')
        obj.key = ele.id
        _f(ele, obj, ary)
      }
      ary.sort(sortFunc)
      dataAry = dataAry.concat(ary)
      ary = []
      const memberAry = await ContactManager.asyGetAllMembers(user.id)

      for (let ele of memberAry) {
        const obj = {}

        obj.image = getAvatarSource(ele.pic)
        obj.key = ele.id
        if (ele.id === user.id) {
          obj.onPress = () => {
            this.props.navigation.navigate('MineTab')
          }
          obj.title = ele.name + ' (我) '
        } else {
          obj.onPress = () => {
            this.go2FriendInfoView(ele)
          }
          obj.title = ele.name
        }
        _f(ele, obj, ary)
      }

      ary.sort(sortFunc)
      dataAry = dataAry.concat(ary)

      this.setState({
        contentAry: (
          <List data={dataAry}></List>
        )
      })
    }

    onChangeText = (t) => {
      t = t.trim()
      this.asyncRender(t)
    }

    subRender () {
      return (
        <ScrollView>
          <SearchBar
            onChangeText={this.onChangeText}
            clearIconStyle={{color: style.color.mainColor}}
          />
          {/* <View> */}
          {/* <View style={{padding: 10}}> */}
          {/* <Text style={{color: '#a0a0a0'}}> */}
          {/* 外部联系人 */}
          {/* </Text> */}
          {/* </View> */}
          {/* <View style={{width: '100%', height: 0, borderTopWidth: 1, borderColor: '#f0f0f0'}}> */}
          {/* </View> */}
          {/* </View> */}
          {/* <List data={[{ */}
          {/* onPress: () => { */}
          {/* this.props.navigation.navigate('ExternalView') */}
          {/* }, */}
          {/* title: '外部联系人', */}
          {/* image: require('../image/contact.png'), */}
          {/* key: 'ExternalView' */}
          {/* }]}></List> */}

          <View>
            <View style={{padding: 10}}>
              <Text style={{color: '#a0a0a0'}}>
                           组织通讯录
              </Text>
            </View>
            <View style={{width: '100%', height: 0, borderTopWidth: 1, borderColor: '#f0f0f0'}}>
            </View>
          </View>
          {this.state.contentAry}
        </ScrollView>

      )
    }
}
