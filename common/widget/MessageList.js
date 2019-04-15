
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
import GroupAvatar from './GroupAvatar'
const dateTimeUtil = require('../util/dateTimeUtil')
const debugLog = require('debug')('debug')
const defaultAvatar = require('../image/defaultAvatar.png')

export default class MessageList extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    let widths
    let fontSizes
    if(Platform.OS === 'android') {
      widths='72%'
      fontSizes=12
    }else{
      widths='80%'
      fontSizes=15
    }
    const contentAry = []
    const avatarLength = 50
    const {data} = this.props
    for (const ele of data) {
      debugLog(ele)
      const {onPress, image, name, content: msgContent, time, newMsgNum, id, deletePress} = ele
      // console.log({id})
      const avatarStyle = {width: avatarLength, height: avatarLength, margin: 5, borderRadius: 5}
      let content = (
        <TouchableOpacity onPress={onPress}
          style={{width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            height: 55,
            alignItems: 'center'}}>
          {Array.isArray(image) ? <GroupAvatar defaultPic={defaultAvatar} avatarStyle={avatarStyle} picAry={image}></GroupAvatar> : <Image resizeMode="cover" style={avatarStyle} source={image} />}
          <View style={{flexDirection: 'row', width: widths, justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10}}>
            <View style={{flexDirection: 'column', justifyContent: 'space-around', alignItems: 'flex-start', height: '100%'}}>
              <View >
                <Text style={{fontSize: 18, fontWeight: '500'}}>
                  {name}
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
                {time ? dateTimeUtil.getDisplayTime(time) : null}
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

      let rowEle = (
        <SwipeRow
          rightOpenValue={-75}

          body={
            content
          }
          right={
            <Button danger onPress={deletePress}>
              <NBIcon active name="trash" />
            </Button>
          }
          key = {id}
        />
      )
      contentAry.push(rowEle)
    }
    return contentAry
  }
}

MessageList.defaultProps = {

}

MessageList.propTypes = {
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
