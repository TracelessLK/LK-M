
import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import { Badge, Button, Icon as NBIcon, Text, SwipeRow
} from 'native-base'
const dateTimeUtil = require('../util/dateTimeUtil')

const debugLog = require('debug')('debug')



export default class List extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    const contentAry = []
    const avatarLength = 50
    const {data} = this.props
    for (const ele of data) {
      debugLog(ele)
      const {onPress, image, name, content: msgContent, time, newMsgNum, id, deletePress} = ele

      let content = (
        <TouchableOpacity onPress={onPress}
          style={{width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            height: 55,
            alignItems: 'center'}}>
          <Image resizeMode="cover" style={{width: avatarLength, height: avatarLength, margin: 5, borderRadius: 5}} source={image} />
          <View style={{flexDirection: 'row', width: '80%', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10}}>
            <View style={{flexDirection: 'column', justifyContent: 'space-around', alignItems: 'flex-start', height: '100%'}}>
              <View >
                <Text style={{fontSize: 18, fontWeight: '500'}}>
                  {name}
                </Text>
              </View>
              <View>
                <Text style={{fontSize: 15, fontWeight: '400', color: '#a0a0a0', marginTop: 3}}>
                  {msgContent}
                </Text>
              </View>
            </View>
            <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100%'}}>
              <Text style={{fontSize: 15, fontWeight: '400', color: '#a0a0a0', marginBottom: 3}}>
                {dateTimeUtil.getDisplayTime(time)}
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
      // rowEle = content
      contentAry.push(rowEle)
    }
    return contentAry
  }
}

List.defaultProps = {

}

List.propTypes = {
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
