import React, {Component} from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
const {engine} = require('LK-C')
const chatManager = engine.get('ChatManager')
const {getAvatarSource, getIconNameByState} = require('../../util')
const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()
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
    console.log({readAry: this.readAry})
    this.msgId = msgId
    const dataAry = []
    for (let key in memberInfoObj) {
      const value = memberInfoObj[key]
      const {id, name, pic} = value
      if (id !== this.user.id) {
        const state = this.readAry.includes(id) ? chatManager.MESSAGE_STATE_TARGET_READ : chatManager.MESSAGE_STATE_SERVER_RECEIVE

        const obj = {
          image: getAvatarSource(pic),
          key: id,
          title: name,
          rightContent: <View><Ionicons name={getIconNameByState(state)} size={20} style={{marginRight: 5, lineHeight: 40}}/></View>
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
// todo: 消息状态事件更新
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
