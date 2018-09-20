import React, { Component } from 'react'
import {
  Button,
  Image,
  Text,
  View
} from 'react-native'

const MFApplyManager = require('../../core/MFApplyManager')
export default class RequestView extends Component<{}> {
  constructor (props) {
    super(props)
  }

  accept=(id) => {
    // WSChannel.acceptMakeFriends(id, () => {
    //   Store.acceptMKFriends(id, () => {
    //     this.setState({update: true})
    //     WSChannel.sendMessage(id, '我们已经是好友了,一起LK吧!', () => {
    //
    //     })
    //   })
    // })
  }

  componentDidMount () {
    (async () => {
      const requestAry = await MFApplyManager.asyGetAll()
      console.log({requestAry})
    })()
  }

  render () {
    let result = []
    // let list = this.requirelist
    // if (list) {
    //   for (let i = 0; i < list.length; i++) {
    //     const req = list[i]
    //     let imageSource = AppUtil.getAvatarSource(req.pic)
    //     let btn = <Button color="#2d8cf0" style={{width: 120, color: '#ffffff'}} onPress={() => { this.accept(req.id) }} title=" 同意 "/>
    //     result[i] =
    //       <View key={i} style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '96%', height: 60, marginTop: 5, paddingBottom: 5, borderColor: '#d0d0d0', borderBottomWidth: 0.5}}>
    //         <Image source={imageSource} style={{flex: 3, margin: 5, width: 50, height: 50}} resizeMode="contain"></Image>
    //         <View style={{flex: 15, margin: 5, height: 32, justifyContent: 'center'}}>
    //           <Text style={{fontWeight: 'bold', color: '#282828'}}>{req.name}</Text>
    //           {/* <Text>{req.id}</Text> */}
    //         </View>
    //         {req.state == 0 ? btn : <Text>已添加</Text>}
    //       </View>
    //   }
    // }
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff'}}>

        {result}
      </View>
    )
  }
}
