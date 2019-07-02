import React, {Component} from 'react'
import {
  ScrollView, Text,
  View
} from 'react-native'

const {engine} = require('@lk/LK-C')

const chatManager = engine.ChatManager
const {getAvatarSource, getIconNameByState} = require('../../util')

const Application = engine.Application
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
    const {msgId} = this.props.navigation.state.params
    const readStateAry = await chatManager.getAllReadState({msgId})
    const dataAry = []
    for (const key in readStateAry) {
      const value = readStateAry[key]
      const {contactId, name, state, pic} = value

      const obj = {
        image: getAvatarSource(pic),
        key: contactId,
        title: name,
        rightContent: <View><Text>{getIconNameByState(state)}</Text></View>
      }
      dataAry.push(obj)
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
