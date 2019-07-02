import React, {Component} from 'react'
import {
  Text
} from 'react-native'
import {Badge} from 'native-base'

const {engine} = require('@lk/LK-C')

const chatManager = engine.ChatManager

const Application = engine.Application
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
    const num = await chatManager.asyGetAllMsgNotReadNum(this.user.id)
    this.updateBadge(num)
    chatManager.on('msgBadgeChanged', this.updateBadgeListener)
  }

  updateBadge = (num) => {
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

  updateBadgeListener = ({param}) => {
    const {num} = param
    this.updateBadge(num)
  }

  componentWillUnmount () {
    chatManager.un('msgBadgeChanged', this.updateBadge)
  }

  render () {
    const scale = 0.65

    return (
      this.state.badge
        ? <Badge danger style={{position: 'absolute', top: -12, right: -17, marginTop: 5, alignItems: 'center', justifyContent: 'center', transform: [{scaleX: scale}, {scaleY: scale}]}}>
          <Text style={{color: '#fff'}}>{this.state.badge}</Text>
        </Badge>
        : null
    )
  }
}

MsgBadge.defaultProps = {}

MsgBadge.propTypes = {}
