import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'
const chatManager = require('../../core/ChatManager')

export default class ReadStateView extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.asyncRender()
  }

  asyncRender = async () => {
    const {msgId, chatId} = this.props.navigation.state.params
    const readState = await chatManager.asyGetGroupMsgReadReport(chatId, msgId)
    console.log({readState})
  }

  componentWillUnmount () {

  }

  render () {
    return (
      <View>
        <Text>ReadStateView</Text>
      </View>
    )
  }
}

ReadStateView.defaultProps = {}

ReadStateView.propTypes = {}
