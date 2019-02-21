import React, { Component } from 'react'
import {
  Image, Platform,
  Text, TouchableOpacity,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'

import style from './ChatView.style'
import MessageText from './MessageText'
import AudioPlay from './AudioPlay'

const { engine } = require('@lk/LK-C')

const chatLeft = require('../image/chat-y-l.png')
const chatRight = require('../image/chat-w-r.png')
const { getAvatarSource, getIconByState } = require('../../util')
const { getFolderId } = require('../../../common/util/commonUtil')
const fireGif = require('../image/fire.gif')

const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()
const chatManager = engine.get('ChatManager')
const { msgBoxStyle } = style

export default class MessageItem extends Component<{}> {
  componentDidMount() {
    this.asyncRender()
  }

  componentWillUnmount() {

  }

  getImageData = (img) => {
    const { url } = img
    const result = this.getCurrentUrl(url)

    return result
  }

  getCurrentUrl = (oldUrl) => {
    let result = oldUrl
    if (Platform.OS === 'ios') {
      result = oldUrl.replace(getFolderId(oldUrl), this.folderId)
    }
    return result
  }

  _getMessage=(rec) => {
    const { onPress } = this.props
    const { type, id } = rec
    let result
    if (type === chatManager.MESSAGE_TYPE_TEXT) {
      const text = (
        <MessageText
          currentMessage={
          { text: rec.content.replace(/&nbsp;/g, ' ') }
        }
          textStyle={{ fontSize: 16, lineHeight: 19, color: rec.state === chatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE ? 'red' : 'black' }}
        />
      )

      result = text
    } else if (rec.type === chatManager.MESSAGE_TYPE_IMAGE) {
      const img = JSON.parse(rec.content)

      img.data = this.getImageData(img)
      const { height, width } = img
      const widthMax = 190
      const heightMax = 400
      const ratio = height / width
      let imgH = widthMax * ratio
      let imgW = widthMax

      if (imgH > heightMax) {
        imgH = heightMax
        imgW = heightMax / ratio
      }

      let imgUri
      if (img && img.data) {
        imgUri = `file://${img.data}`
      }
      result = <TouchableOpacity onPress={onPress}><Image source={{ uri: imgUri }} style={{ width: imgW, height: imgH }} resizeMode="contain" /></TouchableOpacity>
    } else if (rec.type === chatManager.MESSAGE_TYPE_FILE) {
      const file = JSON.parse(rec.content)
      result = (
        <TouchableOpacity>
          <Ionicons name="ios-document-outline" size={40} style={{ marginRight: 5, lineHeight: 40 }} />
          <Text>
            {file.name}
(请在桌面版APP里查看)
          </Text>
        </TouchableOpacity>
      )
    } else if (rec.type === chatManager.MESSAGE_TYPE_AUDIO) {
      const { content } = rec
      let { url } = JSON.parse(content)
      url = this.getCurrentUrl(url)
      const option = {
        url,
        id
      }
      result = <AudioPlay {...option} />
    }
    return result
  }

  doTouchMsgState= ({ state, msgId }) => {
    const { otherSide, isGroupChat, navigation } = this.props
    if (state === chatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE) {
      const channel = lkApp.getLKWSChannel()
      channel.retrySend(otherSide.id, msgId)
    } else if (isGroupChat && (state === chatManager.MESSAGE_STATE_TARGET_READ
      || state === chatManager.MESSAGE_STATE_SERVER_RECEIVE)) {
      navigation.navigate('ReadStateView', {
        msgId,
        chatId: otherSide.id,
        group: otherSide
      })
    }
  }

  asyncRender = () => {

  }

  render() {
    const {
      msg, memberInfoObj, isGroupChat, otherSide, opacity
    } = this.props
    const user = lkApp.getCurrentUser()
    const picSource = getAvatarSource(user.pic)
    const { id, senderUid, state } = msg
    let content = null

    const overLay = (
      <View style={{
        position: 'absolute', top: 0, left: 0, backgroundColor: `rgba(213, 224, 242, ${opacity})`, width: '100%', height: '100%', zIndex: 10
      }}
      />
    )

    if (senderUid !== user.id) {
      // message received
      // fixme: 存在群成员不是好友的情况
      const otherPicSource = getAvatarSource(otherSide.pic)
      content = (
        <View style={[style.recordEleStyle, {
          // backgroundColor: 'red'
        }]}
        >
          {overLay}

          <Image
            source={otherPicSource}
            style={{
              width: 40, height: 40, marginLeft: 5, marginRight: 8
            }}
            resizeMode="contain"
          />
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            {isGroupChat && memberInfoObj[msg.senderUid]
              ? (
                <View style={{ marginBottom: 8, marginLeft: 5 }}>
                  <Text style={{ color: '#808080', fontSize: 13 }}>
                    {' '}
                    {memberInfoObj[msg.senderUid].name}
                  </Text>
                </View>
              )
              : null}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Image source={chatLeft} style={{ width: 11, height: 18, marginTop: 11 }} resizeMode="contain" />
              <View style={[msgBoxStyle, {
                backgroundColor: '#f9e160'
              }]}
              >
                {this._getMessage(msg)}
              </View>
            </View>
          </View>
          <View style={{ marginVertical: 25, marginLeft: -5 }}>
            <Image source={fireGif} style={{ width: 40, height: 40 }} resizeMode="contain" />
          </View>
          <View style={{ marginVertical: 30, marginHorizontal: 5 }}>
            {/* <Text style={{color: 'red'}}>10s</Text> */}
          </View>
        </View>
      )
    } else {
      // message sent
      const icon = getIconByState(state)
      content = (
        <View style={{
          flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start', width: '100%', marginTop: 10
        }}
        >
          {overLay}
          <TouchableOpacity onPress={() => {
            const option = {
              msgId: id,
              state
            }
            this.doTouchMsgState(option)
          }}
          >
            {icon}
          </TouchableOpacity>
          <View style={{ ...msgBoxStyle, backgroundColor: '#ffffff' }}>
            {this._getMessage(msg)}
          </View>
          <Image source={chatRight} style={{ width: 11, height: 18, marginTop: 11 }} resizeMode="contain" />
          <Image
            source={picSource}
            style={{
              width: 40, height: 40, marginRight: 5, marginLeft: 8
            }}
            resizeMode="contain"
          />
        </View>
      )
    }
    return content
  }
}

MessageItem.defaultProps = {
  onPress: () => {

  }
}

MessageItem.propTypes = {
  msg: PropTypes.object,
  isGroupChat: PropTypes.bool,
  memberInfoObj: PropTypes.object,
  onPress: PropTypes.func,
  otherSide: PropTypes.object,
  opacity: PropTypes.number
}
