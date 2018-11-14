import React, { Component } from 'react'
import {
  Button,
  Image,
  Text,
  View
} from 'react-native'
const {engine} = require('@lk/LK-C')
const ChatManager = engine.get('ChatManager')
const {getAvatarSource} = require('../../util')
const MFApplyManager = engine.get('MFApplyManager')
const ContactManager = engine.get('ContactManager')
const style = require('../style')
const noUserImg = require('../image/noUser.png')
const {CenterLayout} = require('@ys/react-native-collection')

export default class RequestView extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {
      content: null
    }
  }
  update = async () => {
    const list = await MFApplyManager.asyGetAll()
    // console.log({list})
    let result = []
    const prop = {
      text: '没有好友请求',
      textStyle: {color: style.color.secondColor},
      img: noUserImg
    }
    const noContent = <CenterLayout {...prop}></CenterLayout>
    if (list && list.length) {
      for (let i = 0; i < list.length; i++) {
        const req = list[i]
        const {pic} = req
        let imageSource = getAvatarSource(pic)
        let btn = <Button color="#2d8cf0" style={{width: 120, color: '#ffffff'}} onPress={() => { this.accept(req) }} title=" 同意 "/>
        result[i] =
          <View key={i} style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '96%', height: 60, marginTop: 5, paddingBottom: 5, borderColor: '#d0d0d0', borderBottomWidth: 0.5}}>
            <Image source={imageSource} style={{flex: 3, margin: 5, width: 50, height: 50}} resizeMode="contain"></Image>
            <View style={{flex: 15, margin: 5, height: 32, justifyContent: 'center'}}>
              <Text style={{fontWeight: 'bold', color: '#282828'}}>{req.name}</Text>
            </View>
            {req.state === -1 ? btn : <Text>已添加</Text>}
          </View>
      }
    } else {
      result = noContent
    }
    this.setState({
      content: result
    })
  }

  accept= async (req) => {
    const {id} = req
    await ChatManager.asyEnsureSingleChat(id)
    await MFApplyManager.accept(id)
    // const text = '我们已经是好友了,一起LK吧!'
    // channel.sendText(id, text)
  }

  componentDidMount () {
    this.update()
    ContactManager.on('contactChanged', this.update)
    MFApplyManager.on('receiveMFApply', this.update)
  }

  componentWillUnmount () {
    ContactManager.un('contactChanged', this.update)
    MFApplyManager.un('receiveMFApply', this.update)
  }

  render () {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff'}}>

        {this.state.content}
      </View>
    )
  }
}
