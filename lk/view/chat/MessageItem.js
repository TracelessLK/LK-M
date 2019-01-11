import React, {Component} from 'react'
import {
  Image,
  Text, TouchableOpacity,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'

const {engine} = require('@lk/LK-C')

const {getAvatarSource, getIconNameByState} = require('../../util')

let Application = engine.getApplication()
const lkApp = Application.getCurrentApp()
const chatManager = engine.get('ChatManager')
const ContactManager = engine.get('ContactManager')

export default class MessageItem extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {
      content: null
    }
  }

  componentDidMount () {
    this.asyncRender()
  }

  componentWillUnmount () {

  }

  asyncRender = async () => {
    const {msg} = this.props
    const user = lkApp.getCurrentUser()
    const {id, senderUid} = msg
    let content

    if (senderUid !== user.id) {
      // message received
      // fixme: 存在群成员不是好友的情况
      const otherSide = await ContactManager.asyGet(user.id, senderUid)
      let otherPicSource = getAvatarSource(otherSide.pic)

      content = (
        <View key={id} style={style.recordEleStyle}>
          <Image source={otherPicSource} style={{width: 40, height: 40, marginLeft: 5, marginRight: 8}} resizeMode="contain"></Image>
          <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'}}>
            {this.isGroupChat && memberInfoObj[msg.senderUid]
              ? <View style={{marginBottom: 8, marginLeft: 5}}>
                <Text style={{color: '#808080', fontSize: 13}}> {memberInfoObj[msg.senderUid].name}</Text>
              </View>
              : null}
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start'}}>
              <Image source={chatLeft} style={{width: 11, height: 18, marginTop: 11}} resizeMode="contain"></Image>
              <View style={{...msgBoxStyle, backgroundColor: '#f9e160'}}>
                {this._getMessage(msg)}
              </View>
            </View>
          </View>
          <View style={{marginVertical: 10, marginHorizontal: 10}}>
            <Text style={{color: 'red'}}>10s</Text>
          </View>
        </View>
      )
    } else {
      // message sent
      // console.log({sentMsg: msg})
      let iconName = getIconNameByState(msg.state)
      content = (
        <View key={id} style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start', width: '100%', marginTop: 10}}>
          <TouchableOpacity onPress={() => {
            const option = {
              msgId: id,
              state: msg.state
            }
            this.doTouchMsgState(option)
          }}>
            <Ionicons name={iconName} size={20} style={{marginRight: 5, lineHeight: 40, color: msg.state === chatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE ? 'red' : 'black'}}/>
          </TouchableOpacity>
          <View style={{...msgBoxStyle, backgroundColor: '#ffffff'}}>
            {this._getMessage(msg)}
          </View>
          <Image source={chatRight} style={{width: 11, height: 18, marginTop: 11}} resizeMode="contain"></Image>
          <Image source={picSource} style={{width: 40, height: 40, marginRight: 5, marginLeft: 8}} resizeMode="contain"></Image>
        </View>
      )
    }
  }

  render () {
    return (
      <View>
        <Text>{this.state.content}</Text>
      </View>
    )
  }
}

MessageItem.defaultProps = {

}

MessageItem.propTypes = {
  msg: PropTypes.object
}
