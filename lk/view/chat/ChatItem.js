
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
const {ChatManager} = engine


const dateTimeUtil = require('../../../common/util/dateTimeUtil')
const defaultAvatar = require('../image/defaultAvatar.png')
const { getAvatarSource } = require('../../util')

export default class ChatItem extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    ChatManager.on('chatChange', this.chatChangeListener)
  }

  chatChangeListener = async ({param}) => {
    const {chatId, chatNotReadNum, name} = param
    if (chatId === this.props.item.id) {
      const signleChat = await ChatManager.getSingeChat({
        chatId
      })
      this.setState({
        chatNotReadNum,
        name
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
    const {item} = this.props
    const {imageAry, name, content, time, newMsgNum, id, memberCount, imgMapObj, isGroup} = item
    const chatNotReadNum = this.state.chatNotReadNum === undefined ? newMsgNum : this.state.chatNotReadNum
    const avatarStyle = {width: avatarLength, height: avatarLength, margin: 5, borderRadius: 5}
    const viewContent = (
      <TouchableOpacity onPress={() => {
        this.chat({
          isGroup,
          otherSideId: id,
          chatName: name,
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
                {this.state.name || name}
              </Text>
            </View>
            <View>
              <Text style={{fontSize: fontSizes, fontWeight: '400', color: '#a0a0a0', marginTop: 3}}>
                {content}
              </Text>
            </View>
          </View>
          <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100%'}}>
            <Text style={{fontSize: fontSizes, fontWeight: '400', color: '#a0a0a0', marginBottom: 3}}>
              {time ? dateTimeUtil.getDisplayTime(time) : null}
            </Text>
            <View>
              {chatNotReadNum
                ? <Badge style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}>
                  <Text style={{}}>{chatNotReadNum}</Text>
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
            ChatManager.asyDeleteChat({chatIdy: id})
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
  /*
       * [{
       *  onPress:(ele)=>{},
       *  image:require('../image/folder.png',
       *  title:''
       *
       * }]
       *
       *
       *
       */

  data: PropTypes.array

}
