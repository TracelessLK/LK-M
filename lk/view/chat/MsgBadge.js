import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'
import {Badge} from 'native-base'
const LKChatProvider = require('../../logic/provider/LKChatProvider')
const chatManager = require('../../core/ChatManager')

export default class MsgBadge extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {
      badge: null
    }
  }

  async componentDidMount () {
    let num = await LKChatProvider.asyGetAllMsgNotReadNum(this.user.id)
    this.updateBadge(num)
    chatManager.on('msgBadgeChange', this.updateBadge)
  }

  updateBadge (num) {
    if (num) {
      if (num < 10) {
        num = ` ${num} `
      }
      this.setState({
        badge: num
      })
    }
  }
  componentWillUnmount () {
    chatManager.un('msgBadgeChange', this.updateBadge)
  }

  render () {
    const scale = 0.6

    return (
      this.state.badge
        ? <Badge danger style={{position: 'absolute', top: -12, right: -17, transform: [{scaleX: scale}, {scaleY: scale}]}}>
          <Text style={{color: '#fff'}}>{this.state.badge}</Text>
        </Badge>
        : null
    )
  }
}

MsgBadge.defaultProps = {}

MsgBadge.propTypes = {}
