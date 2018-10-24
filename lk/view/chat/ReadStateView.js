import React, {Component} from 'react'
import {
  ScrollView,
  Text, TouchableOpacity,
  View
} from 'react-native'
import PropTypes from 'prop-types'
const chatManager = require('../../core/ChatManager')
const {getAvatarSource} = require('../../util')
const lkApp = require('../../LKApplication').getCurrentApp()
const common = require('@external/common')
const {List} = common

export default class ReadStateView extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {}
    this.user = lkApp.getCurrentUser()
  }

  componentDidMount () {
    this.asyncRender()
  }

  asyncRender = async () => {
    const {msgId, chatId, group} = this.props.navigation.state.params
    const {memberInfoObj} = group
    const readState = await chatManager.asyGetGroupMsgReadReport(chatId, msgId)
    this.readAry = readState.map(ele => ele.id)
    this.msgId = msgId
    const dataAry = []
    for (let key in memberInfoObj) {
      const value = memberInfoObj[key]
      const {id, name, pic} = value

      if (id !== this.user.id) {
        const obj = {
          image: getAvatarSource(pic),
          key: id,
          title: name
        }
        dataAry.push(obj)
      }
      const content = <View style={{marginVertical: 20}}>
        <List data={dataAry}></List>
      </View>
      this.setState({
        content
      })
    }
  }

  componentWillUnmount () {

  }

  render () {
    return (
      <ScrollView>
        <View>
          {this.state.content}
        </View>
      </ScrollView>
    )
  }
}

ReadStateView.defaultProps = {}

ReadStateView.propTypes = {}
