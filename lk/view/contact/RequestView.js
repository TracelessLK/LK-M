import React, { Component } from 'react'
import {
  Button,
  Image,
  Text,
  View
} from 'react-native'
const {getAvatarSource} = require('../../util')
const MFApplyManager = require('../../core/MFApplyManager')
const lkApp = require('../../LKApplication').getCurrentApp()
export default class RequestView extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {
      content: null
    }
  }

  accept= async (id, serverIP, serverPort) => {
    const channel = lkApp.getLKWSChannel()
    await channel.acceptMF(id, serverIP, serverPort)
    const text = '我们已经是好友了,一起LK吧!'
    channel.sendText(id, text)
  }

  componentDidMount () {
    (async () => {
      const list = await MFApplyManager.asyGetAll()
      console.log({list})
      let result = []
      if (list) {
        for (let i = 0; i < list.length; i++) {
          const req = list[i]
          const {pic, id, serverIP, serverPort} = req
          let imageSource = getAvatarSource(pic)
          let btn = <Button color="#2d8cf0" style={{width: 120, color: '#ffffff'}} onPress={() => { this.accept(id, serverIP, serverPort) }} title=" 同意 "/>
          result[i] =
            <View key={i} style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '96%', height: 60, marginTop: 5, paddingBottom: 5, borderColor: '#d0d0d0', borderBottomWidth: 0.5}}>
              <Image source={imageSource} style={{flex: 3, margin: 5, width: 50, height: 50}} resizeMode="contain"></Image>
              <View style={{flex: 15, margin: 5, height: 32, justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold', color: '#282828'}}>{req.name}</Text>
              </View>
              {req.state === -1 ? btn : <Text>已添加</Text>}
            </View>
        }
      }
      this.setState({
        content: result
      })
    })()
  }

  render () {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff'}}>
        {this.state.content}
      </View>
    )
  }
}
