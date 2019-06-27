import React from 'react'

import ScreenWrapper from '../../common/ScreenWrapper'
import NavigateList from '../../common/NavigateList'

const { engine } = require('@lk/LK-C')

const ChatManager = engine.ChatManager


export default class DbView extends ScreenWrapper {
  state = {
    content: null
  }

  async componentDidMount() {
    const { navigation } = this.props
    const tableNameAry = await ChatManager.getAllTableAry()
    const viewNameAry = await ChatManager.getAllViewAry()

    const itemAry = [
      {
        title: '数据库表',
        onPress() {
          navigation.navigate('TableListView', {
            nameAry: tableNameAry
          })
        }
      },
      {
        title: '数据库视图',
        onPress() {
          navigation.navigate('TableListView', {
            nameAry: viewNameAry
          })
        }
      }
    ]

    this.setState({
      content: <NavigateList itemAry={itemAry} />
    })
  }

  subRender() {
    return this.state.content
  }
}
