import React, {Component} from 'react'
import {
  Text
} from 'react-native'
import {Badge} from 'native-base'
const {engine} = require('@lk/LK-C')
const chatManager = require('../../manager/LKChatManager')

let Application = engine.getApplication()
const lkApp = Application.getCurrentApp()

export default class MsgBadge extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {
      badge: null
    }
    this.user = lkApp.getCurrentUser()
  }

  async componentDidMount () {
    let num = await chatManager.asyGetAllMsgNotReadNum(this.user.id)
    this.updateBadge(num)
    chatManager.on('msgBadgeChanged', this.updateBadge)
  }

  updateBadge = (num) => {
    // console.log({updateNum:num})
    if (num) {
      if (num < 10) {
        num = ` ${num} `
      }
      this.setState({
        badge: num
      })
    } else {
      this.setState({
        badge: null
      })
    }
  }
  componentWillUnmount () {
    chatManager.un('msgBadgeChanged', this.updateBadge)
  }

  render () {
    const scale = 0.65

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
