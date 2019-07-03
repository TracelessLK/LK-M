
import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView
} from 'react-native'
import { ListItem } from 'react-native-elements'

const common = require('@external/common')

const { commonUtil, List, LoadingView} = common
const {debounceFunc} = commonUtil
const {engine} = require('@lk/LK-C')

const Application = engine.Application
const lkApp = Application.getCurrentApp()
const ContactManager = engine.ContactManager
const style = require('../style')
const {getAvatarSource, addExternalFriend} = require('../../util')
const {HeaderRightButton, CenterLayout} = require('@ys/react-native-collection')
const noUserImg = require('../image/noUser.png')

export default class ExternalView extends Component<{}> {
    static navigationOptions =({navigation}) => {
      const prop = {
        title: '添加',
        color: style.color.mainColor,
        onPress: () => {
          addExternalFriend({navigation})
        }
      }
      return {
        headerTitle: '外部联系人',
        headerRight: <HeaderRightButton {...prop}/>
      }
    }

    constructor (props) {
      super(props)
      this.state = {
        content: null,
        loading: true
      }
      this.mounted = false
    }

    update = () => {
      if (this.mounted) {
        console.log('update externalView')
        this.asyncRender()
      }
    }

    componentDidMount () {
      this.mounted = true
      this.asyncRender()
      ContactManager.on('contactChanged', this.update)
    }

    componentWillUnmount () {
      this.mounted = false
      ContactManager.un('contactChanged', this.update)
    }

    go2FriendInfoView=debounceFunc((f) => {
      this.props.navigation.navigate('FriendInfoView', {contactId: f.id})
    })

    async asyncRender (filterText) {
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

      const friendAry = await ContactManager.asyGetAllFriends(user.id)
      console.log({friendAry})
      for (const ele of friendAry) {
        const obj = {}
        obj.onPress = () => {
          this.go2FriendInfoView(ele)
        }
        obj.title = ele.name
        obj.image = getAvatarSource(ele.pic)
        obj.key = ele.id
        _f(ele, obj, ary)
      }

      ary.sort(sortFunc)
      dataAry = dataAry.concat(ary)

      const prop = {
        text: '无外部联系人,请扫描二维码添加好友',
        textStyle: {color: style.color.secondColor, fontSize: 18},
        img: noUserImg
      }
      const noUser = <CenterLayout {...prop}></CenterLayout>
      // console.log({dataAry})
      const content = dataAry.length ? (
        <View>
          {/* <SearchBar */}
          {/* onChangeText={this.onChangeText} */}
          {/* clearIconStyle={{color: style.color.mainColor}} */}
          {/* /> */}
          <View>
            <View style={{padding: 10}}>
              <Text style={{color: '#a0a0a0'}}>
                            外部联系人
              </Text>
            </View>
            <View style={{width: '100%', height: 0, borderTopWidth: 1, borderColor: '#f0f0f0'}}>
            </View>
            <List data={dataAry}></List>
          </View>
        </View>
      ) : noUser
      this.setState({
        content,
        loading: false
      })
    }

    onChangeText = (t) => {
      t = t.trim()
      this.asyncRender(t)
    }

    render () {
      const list = [
        {
          title: `好友请求`,
          icon: 'contacts',
          onPress: debounceFunc(() => {
            this.props.navigation.navigate('RequestView')
          })
        }]
      return (
        <ScrollView>
          <View style={style.listStyle}>
            {
              list.map((item, i) =>
                <ListItem
                  key={i}
                  title={item.title}

                  rightIcon={item.rightIconColor ? {style: {color: item.rightIconColor}} : {}}
                  leftIcon={{name: item.icon, style: {}}}
                  subtitle={item.subtitle}
                  onPress={item.onPress}
                />)
            }
          </View>
          <LoadingView loading={this.state.loading} content={this.state.content}></LoadingView>
        </ScrollView>
      )
    }
}

ExternalView.defaultProps = {

}

ExternalView.propTypes = {

}
