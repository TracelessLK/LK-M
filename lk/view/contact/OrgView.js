
import React from 'react'
import {
  ScrollView,
  Text,
  View
} from 'react-native'
import ScreenWrapper from "../common/ScreenWrapper"

const {engine} = require('@lk/LK-C')

const Application = engine.Application
const lkApp = Application.getCurrentApp()
const ContactManager = engine.ContactManager
const OrgManager = engine.OrgManager
const common = require('@external/common')

const {SearchBar, commonUtil, List, LoadingView} = common
const {debounceFunc} = commonUtil
const {getAvatarSource} = require('../../util')
const style = require('../style')
const noUserImg = require('../image/noUser.png')
const {CenterLayout} = require('@ys/react-native-collection')

export default class OrgView extends ScreenWrapper {
    static navigationOptions =({ navigation }) => {
      const {org} = navigation.state.params
      return {
        headerTitle: org.name
      }
    }

    constructor (props) {
      super(props)
      this.state = {
        content: null,
        loading: true
      }
      this.org = this.props.navigation.state.params.org
    }

    componentDidMount () {
      // for(let event of this.eventAry){
      //     // Store.on(event,this.update);
      // }
      this.asyncRender()
    }

    componentDidUpdate () {
    }

    componentWillUnmount () {

    }

    onChangeText = (t) => {
      t = t.trim()
      this.asyncRender(t)
    }

    go2FriendInfoView=debounceFunc((f) => {
      this.props.navigation.navigate('FriendInfoView', {friend: f})
    })

    go2OrgView = debounceFunc((org) => {
      this.props.navigation.navigate({routeName: 'OrgView', params: {org}, key: org.id})
    })

    async asyncRender (filterText) {
      const user = lkApp.getCurrentUser()
      const orgAry = await OrgManager.asyGetChildren(this.org.id, user.id)
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
      let ary = []
      for (const ele of orgAry) {
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
      const memberAry = await ContactManager.asyGetMembersByOrg(user.id, this.org.id)

      for (const ele of memberAry) {
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
      const prop = {
        text: '本部门没有成员',
        textStyle: {color: style.color.secondColor},
        img: noUserImg
      }
      const noContent = <CenterLayout {...prop}></CenterLayout>

      let content
      if (dataAry.length) {
        content = (
          <ScrollView>
            <SearchBar
              onChangeText={this.onChangeText}
              clearIconStyle={{color: style.color.mainColor}}
            />
            <View>
              <View style={{padding: 10}}>
                <Text style={{color: '#a0a0a0'}}>
                                组织通讯录
                </Text>
              </View>
              <View style={{width: '100%', height: 0, borderTopWidth: 1, borderColor: '#f0f0f0'}}>
              </View>
            </View>
            <List data={dataAry}></List>
          </ScrollView>
        )
      } else {
        content = noContent
      }
      this.setState({
        content,
        loading: false
      })
    }

    subRender () {
      return <LoadingView loading={this.state.loading} content={this.state.content}></LoadingView>
    }
}

OrgView.defaultProps = {

}

OrgView.propTypes = {

}
