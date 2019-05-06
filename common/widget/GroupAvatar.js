/* eslint-enable */

import React, { Component } from 'react'
import {
  Platform,
  Image,
  View
} from 'react-native'
import commonUtil from '../util/commonUtil'
import PropTypes from 'prop-types'

const {getAvatarSource} = commonUtil
const _ = require('lodash')

export default class GroupAvatar extends Component<{}> {
  render () {
    let {picAry, defaultPic, avatarStyle} = this.props

    if (picAry.length > 4) {
      picAry = picAry.slice(0, 4)
    }
    const avatarAry = []
    for (let i = 0; i < picAry.length; i++) {
      const pic = picAry[i]
      if (i === 0 && picAry.length === 3) {
        avatarAry.push(<Image key={i} source={getAvatarSource(pic, defaultPic)} style={{width: 22, height: 22, margin: 0.5, marginHorizontal: 10, borderRadius: 1}} resizeMode="contain"></Image>)
      } else {
        avatarAry.push(<Image key={i} source={getAvatarSource(pic, defaultPic)} style={{width: 22, height: 22, margin: 0.5, borderRadius: 1}} resizeMode="contain"></Image>)
      }
    }
    let defaultAvatarStyle = {}
    if (Platform.OS === 'android') {
      defaultAvatarStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#f0f0f0',
        width: 51,
        height: 51,
        marginBottom: 10,
        flexWrap: 'wrap',
        padding: 1
      }
    } else {
      defaultAvatarStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#f0f0f0',
        width: 51,
        height: 51,
        marginBottom: 20,
        flexWrap: 'wrap',
        padding: 1
      }
    }
    _.merge(defaultAvatarStyle, avatarStyle)
    return (
      <View style={defaultAvatarStyle}>
        {avatarAry}
      </View>
    )
  }
}

GroupAvatar.defaultProps = {

}

GroupAvatar.propTypes = {
  picAry: PropTypes.array,
  defaultPic: PropTypes.node,
  avatarStyle: PropTypes.object
}
