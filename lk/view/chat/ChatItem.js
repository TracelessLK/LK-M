
import React, { Component } from 'react'
import {
  Platform,
  View,
  TouchableOpacity,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import { Badge, Button, Icon as NBIcon, Text, SwipeRow
} from 'native-base'
import GroupAvatar from '../../../common/widget/GroupAvatar'

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
    }
    this.user = Application.getCurrentApp().getCurrentUser()
  }

  componentDidMount() {
    ChatManager.on('chatChange', this.chatChangeListener)
  }

  chatChangeListener = async ({param}) => {
    const {chatId} = param
    if (chatId === this.props.id) {
      const signleChat = await ChatManager.getSingeChat({
        chatId
      })

      const {chatName, activeTime,
        // MessageCeiling, focus, state,
        newMsgNum, avatar, msgContent} = signleChat
      this.setState({
        newMsgNum,
        chatName,
        activeTime,
        avatar,
        msgContent
      })
    }
  }

  componentWillUnmount() {
    ChatManager.un('chatChange', this.chatChangeListener)
  }

  chat = debounceFunc((option) => {
    this.props.navigation.navigate('ChatView', option)
  })

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

    const imgMapObj = {}
    const imageAry = []
    if (avatar) {
      if (isGroup) {
        for (let eleStr of avatar.split('@sep@')) {
          const ary = eleStr.split('@id@')
          const pic = ary[0]
          imgMapObj[ary[1]] = pic
          imageAry.push(pic)
        }
      } else {
        imgMapObj[id] = avatar
        imgMapObj[this.user.id] = this.user.pic
        imageAry.push(avatar)
      }
    }
    const avatarStyle = {width: avatarLength, height: avatarLength, margin: 5, borderRadius: 5}
    const viewContent = (
      <TouchableOpacity onPress={() => {
        this.chat({
          isGroup,
          otherSideId: id,
          chatName,
          memberCount,
          imgMapObj
        })
      }}
        style={{width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          height: 55,
          alignItems: 'center'}}>
        {imageAry.length > 1 ? <GroupAvatar defaultPic={defaultAvatar} avatarStyle={avatarStyle} picAry={imageAry}></GroupAvatar> : <Image resizeMode="cover" style={avatarStyle} source={getAvatarSource(imageAry[0])} />}
        <View style={{flexDirection: 'row', width: widths, justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10}}>
          <View style={{flexDirection: 'column', justifyContent: 'space-around', alignItems: 'flex-start', height: '100%'}}>
            <View >
              <Text style={{fontSize: 18, fontWeight: '500'}}>
                {chatName}
              </Text>
            </View>
            <View>
              <Text style={{fontSize: fontSizes, fontWeight: '400', color: '#a0a0a0', marginTop: 3}}>
                {msgContent}
              </Text>
            </View>
          </View>
          <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100%'}}>
            <Text style={{fontSize: fontSizes, fontWeight: '400', color: '#a0a0a0', marginBottom: 3}}>
              {dateTimeUtil.getDisplayTime(new Date(activeTime))}
            </Text>
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

    contents = (
      <SwipeRow
        rightOpenValue={-75}
        body={
          viewContent
        }
        right={
          <Button danger onPress={() => {
            ChatManager.asyDeleteChat({chatId: id})
          }
          }>
            <NBIcon active name="trash" />
          </Button>
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
  chatName: PropTypes.string
}
