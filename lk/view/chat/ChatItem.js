
import React, { Component } from 'react'
import {
  Platform,
  View,
  TouchableOpacity,
  Image, Vibration
} from 'react-native'
import PropTypes from 'prop-types'
import { Badge, Button, Text, SwipeRow
} from 'native-base'
import GroupAvatar from '../../../common/widget/GroupAvatar'

const sjx = require('../image/sjx.png')
const { engine } = require('@lk/LK-C')
const { commonUtil } = require('@external/common')

const { debounceFunc } = commonUtil
const {ChatManager, Application} = engine


const dateTimeUtil = require('../../../common/util/dateTimeUtil')
const defaultAvatar = require('../image/defaultAvatar.png')
const { getAvatarSource } = require('../../util')

export default class ChatItem extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {
      peakTime: this.props.peakTime,
      focus: this.props.focus,
      reserve1: this.props.reserve1
    }
    this.user = Application.getCurrentApp().getCurrentUser()
  }

  componentDidMount() {
    ChatManager.on('chatChange', this.chatChangeListener)
    ChatManager.on('otherMsgReceived', this.chatVibration)
  }

  chatVibration = ({param}) => {
    const {chatId} = param
    if (chatId === this.props.id) {
      if (this.state.focus) {
        Vibration.vibrate()
      }
    }
  }

  chatChangeListener = async ({param}) => {
    const {chatId} = param
    if (chatId === this.props.id) {
      const singleChat = await ChatManager.getSingeChat({
        chatId
      })

      const {chatName, activeTime,
        // MessageCeiling, focus, state,
        newMsgNum, avatar, msgContent, reserve1} = singleChat
      this.setState({
        newMsgNum,
        chatName,
        activeTime,
        avatar,
        msgContent,
        reserve1
      })
    }
  }

  componentWillUnmount() {
    ChatManager.un('chatChange', this.chatChangeListener)
    ChatManager.un('otherMsgReceived', this.chatVibration)
  }

  chat = debounceFunc((option) => {
    this.props.navigation.navigate('ChatView', option)
  })

  topChat = async ({userId, chatId, peakTime}) => {
    let Message = peakTime
    if (Message !== null) {
      await ChatManager.asyMessageCeiling(null, userId, chatId)
      this.setState({
        peakTime: null
      })
    } else {
      await ChatManager.asyMessageCeiling(Date.now(), userId, chatId)
      this.setState({
        peakTime: Date.now()
      })
    }
  }

  focusChat = async ({userId, chatId, focus}) => {
    let focuss = focus
    if (focuss === 1) {
      await ChatManager.asyMessageFocus(null, userId, chatId)
      this.setState({
        focus: null
      })
    } else {
      await ChatManager.asyMessageFocus(1, userId, chatId)
      this.setState({
        focus: 1
      })
    }
  }

  render () {
    let widths
    let fontSizes
    if (Platform.OS === 'android') {
      widths = '72%'
      fontSizes = 12
    } else {
      widths = '80%'
      fontSizes = 15
    }
    let contents
    const avatarLength = 50
    const { id } = this.props
    const msgContent = this.state.msgContent || this.props.msgContent
    const activeTime = this.state.activeTime || this.props.activeTime
    const avatar = this.state.avatar === undefined ? this.props.avatar : this.state.avatar
    const newMsgNum = this.state.newMsgNum === undefined ? this.props.newMsgNum : this.state.newMsgNum
    const isGroup = this.state.isGroup === undefined ? this.props.isGroup : this.state.isGroup
    const memberCount = this.state.memberCount || this.props.memberCount
    const chatName = this.state.chatName || this.props.chatName
    const peakTime = this.state.peakTime
    const focus = this.state.focus
    const reserve1 = this.state.reserve1

    const imageAry = []
    if (avatar) {
      if (isGroup) {
        for (let eleStr of avatar.split('@sep@')) {
          const ary = eleStr.split('@id@')
          const pic = ary[0]
          imageAry.push(pic)
        }
      } else {
        imageAry.push(avatar)
      }
    }
    const avatarStyle = {width: avatarLength, height: avatarLength, margin: 5, borderRadius: 5}
    const sjxStyle = {alignItems: 'flex-end', width: 10, height: 10, marginTop: '-24%', marginLeft: '0%'}
    const viewContent = (
      <TouchableOpacity onPress={() => {
        this.chat({
          isGroup,
          otherSideId: id,
          chatName,
          memberCount,
          avatar,
          reserve1
        })
      }}
        style={{width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          height: 55,
          alignItems: 'center'}}>
        {imageAry.length > 1 ? <GroupAvatar defaultPic={defaultAvatar} avatarStyle={avatarStyle} picAry={imageAry}></GroupAvatar> : <Image resizeMode="cover" style={avatarStyle} source={getAvatarSource(imageAry[0])} />}
        <View style={{flexDirection: 'row', width: widths, justifyContent: 'space-between', alignItems: 'center', marginLeft: 8}}>
          <View style={{flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            flexShrink: 1,
            height: '100%'}}>
            <View >
              <Text style={{fontSize: 18, fontWeight: '500'}}>
                {focus === 1 ? '⭐' + chatName : chatName}
              </Text>
            </View>
            <View>
              <Text style={{fontSize: fontSizes, fontWeight: '400', color: '#a0a0a0', marginTop: 3}} numberOfLines={1}>
                {reserve1 === null || reserve1 === ''
                  ? msgContent
                  : <Text>
                    <Text style={{color: 'red'}}>[草稿] </Text>
                    <Text style={{color: '#a0a0a0'}}>{reserve1}</Text>
                  </Text>
                }
              </Text>
            </View>
          </View>
          <View style={{display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '100%',
            minWidth: 60}}>
            <View>
              {peakTime === null ? null : <Image style={sjxStyle} source={sjx} />}
            </View>
            <View>
              <Text style={{fontSize: fontSizes, fontWeight: '400', color: '#a0a0a0', marginBottom: 3}}>
                {dateTimeUtil.getDisplayTime(new Date(activeTime))}
              </Text>
            </View>
            <View>
              {newMsgNum
                ? <Badge style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}>
                  <Text style={{}}>{newMsgNum}</Text>
                </Badge>
                : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )

    const viewRight = (
      <TouchableOpacity style={{ display: 'flex', flex: 1, alignItems: "flex-start", justifyContent: "flex-start", flexDirection: "row", height: '100%'}}>
        <Button style={{height: '90%', backgroundColor: 'gray', alignSelf: 'flex-start' }} onPress={() => {
          this.topChat({userId: this.user.id, chatId: id, peakTime})
        }
          }>
          <Text style={{fontSize: 15, fontWeight: '400', color: '#FFFFFF', marginTop: 3}}>{peakTime === null ? '置顶' : '取消置顶'}</Text>
        </Button>
        <Button style={{height: '90%'}} warning onPress={() => {
          this.focusChat({userId: this.user.id, chatId: id, focus})
        }
        }>
          <Text style={{fontSize: 15, fontWeight: '400', color: '#FFFFFF', marginTop: 3}}>{focus === 1 ? '取消提醒' : '提醒'}</Text>
        </Button>
        <Button style={{height: '90%'}} danger onPress={() => {
          ChatManager.asyDeleteChat({chatId: id})
        }
          }>
          <Text style={{fontSize: 15, fontWeight: '400', color: '#FFFFFF', marginTop: 3}}>{'删除'}</Text>
        </Button>
      </TouchableOpacity>
    )

    contents = (
      <SwipeRow
        rightOpenValue={-225}
        body={
          viewContent
        }
        right={
          viewRight
        }
        key={id}
            />
    )
    return contents
  }
}

ChatItem.defaultProps = {

}

ChatItem.propTypes = {
  msgContent: PropTypes.string,
  activeTime: PropTypes.number,
  newMsgNum: PropTypes.number,
  id: PropTypes.string,
  memberCount: PropTypes.number,
  isGroup: PropTypes.bool,
  chatName: PropTypes.string,
  peakTime: PropTypes.number,
  focus: PropTypes.number,
  reserve1: PropTypes.string
}
