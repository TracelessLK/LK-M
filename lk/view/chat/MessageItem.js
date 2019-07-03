import React, { Component } from 'react'
import {
  Image, Platform,
  Text, TouchableOpacity,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import RNFetchBlob from 'react-native-fetch-blob'

import style from './ChatView.style'
import MessageText from './MessageText'
import AudioPlay from './AudioPlay'

const { engine } = require('@lk/LK-C')

const chatLeft = require('../image/chat-y-l.png')
const chatRight = require('../image/chat-w-r.png')
const { getAvatarSource, getIconByState } = require('../../util')
const { getFolderId } = require('../../../common/util/commonUtil')

const Application = engine.Application
const lkApp = Application.getCurrentApp()
const chatManager = engine.ChatManager
const { msgBoxStyle } = style
let folderId
if (Platform.OS === 'ios') {
  folderId = getFolderId(RNFetchBlob.fs.dirs.DocumentDir)
}
export default class MessageItem extends Component<{}> {
  constructor() {
    super()
    this.state = {

    }
  }

  componentDidMount() {
    chatManager.on('selfMsgRead', this.selfMsgReadListener)
  }

  selfMsgReadListener = ({param}) => {
    const {msgId, state} = param
    if (msgId === this.props.msgId) {
      this.setState({
        state
      })
    }
  }

  componentWillUnmount() {
    chatManager.un('selfMsgRead', this.selfMsgReadListener)
  }

  getImageData = (img) => {
    const { url } = img
    const result = this.getCurrentUrl(url)

    return result
  }

  getCurrentUrl = (oldUrl) => {
    let result = oldUrl
    if (Platform.OS === 'ios') {
      result = oldUrl.replace(getFolderId(oldUrl), folderId)
    }
    return result
  }

  _getMessage=() => {
    const {type, content, state} = this.props
    const { onPress } = this.props
    let result
    if (type === chatManager.MESSAGE_TYPE_TEXT) {
      const text = (
        <MessageText
          currentMessage={
          { text: content}
        }
          textStyle={{ fontSize: 16, lineHeight: 19, color: state === chatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE ? 'red' : 'black' }}
        />
      )

      result = text
    } else if (type === chatManager.MESSAGE_TYPE_IMAGE) {
      const img = JSON.parse(content)

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
    } else if (type === chatManager.MESSAGE_TYPE_FILE) {
      const file = JSON.parse(content)
      result = (
        <TouchableOpacity>
          <Ionicons name="ios-document-outline" size={40} style={{ marginRight: 5, lineHeight: 40 }} />
          <Text>
            {file.name}
(请在桌面版APP里查看)
          </Text>
        </TouchableOpacity>
      )
    } else if (type === chatManager.MESSAGE_TYPE_AUDIO) {
      let { url } = JSON.parse(content)
      url = this.getCurrentUrl(url)
      const option = {
        url
      }
      result = <AudioPlay {...option} />
    }
    return result
  }

  doTouchMsgState= ({ state, msgId }) => {
    const { chatId, isGroupChat, navigation } = this.props
    if (state === chatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE) {
      const channel = lkApp.getLKWSChannel()
      channel.retrySend(chatId, msgId)
    } else if (isGroupChat && (state === chatManager.MESSAGE_STATE_TARGET_READ
      || state === chatManager.MESSAGE_STATE_SERVER_RECEIVE)) {
      navigation.navigate('ReadStateView', {
        msgId
      })
    }
  }

  render() {
    const {msgId, senderName, isGroupChat, pic, opacity, isSelf, state, readNum} = this.props

    const picSource = getAvatarSource(pic)
    let content = null

    const overLay = (
      <View
        style={{
          position: 'absolute', top: 0, left: 0, backgroundColor: `rgba(213, 224, 242, ${opacity})`, width: '100%', height: '100%', zIndex: 10
        }}
        pointerEvents="box-none"
      />
    )

    if (!isSelf) {
      // message received
      // fixme: 存在群成员不是好友的情况
      content = (
        <View style={[style.recordEleStyle, {
        }]}
        >
          {overLay}
          <Image
            source={picSource}
            style={{
              width: 40, height: 40, marginLeft: 5, marginRight: 8
            }}
            resizeMode="contain"
          />
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
            {isGroupChat
              ? (
                <View style={{ marginBottom: 8, marginLeft: 5 }}>
                  <Text style={{ color: '#808080', fontSize: 13 }}>
                    {' '}
                    {senderName}
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
                {this._getMessage()}
              </View>
            </View>
          </View>
          <View style={{ marginVertical: isGroupChat ? 25 : 5, marginLeft: 0 }}>
          </View>
          <View style={{ marginVertical: 30, marginHorizontal: 5 }}>
            {/* <Text style={{color: 'red'}}>10s</Text> */}
          </View>
        </View>
      )
    } else {
      // message sent
      const icon = getIconByState({
        state: this.state.state || state,
        notReadNum: this.memberCount - readNum - 1,
        showDetail: isGroupChat
      })
      content = (
        <View style={{
          flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start', width: '100%', marginTop: 10
        }}
        >
          {overLay}
          {isGroupChat ? <TouchableOpacity onPress={() => {
            const option = {
              msgId,
              state
            }
            this.doTouchMsgState(option)
          }
          }
          >
            {icon}
          </TouchableOpacity> : icon}

          <View style={{ ...msgBoxStyle, backgroundColor: '#ffffff' }}>
            {this._getMessage()}
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
  msgId: PropTypes.string,
  senderName: PropTypes.string,
  isGroupChat: PropTypes.bool,
  isSelf: PropTypes.bool,
  pic: PropTypes.any,
  type: PropTypes.number,
  content: PropTypes.string,
  chatId: PropTypes.string,
  onPress: PropTypes.func,
  opacity: PropTypes.number,
  state: PropTypes.number,
  readNum: PropTypes.number,
  navigation: PropTypes.object
}
