import React from 'react'

import ScreenWrapper from '../../common/ScreenWrapper'
import NavigateList from '../../common/NavigateList'

const { engine } = require('@lk/LK-C')

const ChatManager = engine.get('ChatManager')


export default class TableListView extends ScreenWrapper {
  constructor(props) {
    super(props)
    this.state = {
      tableNameAry: []
    }
  }

  async componentDidMount() {
    const tableNameAry = await ChatManager.getAllTableAry()
    this.setState({
      tableNameAry
    })
  }

  subRender() {
    const { navigation } = this.props
    const { nameAry } = navigation.state.params

    const itemAry = nameAry.map(ele => ({
      title: ele,
      onPress() {
        navigation.navigate('DbViewTable', {
          tablename: ele
        })
      }
    }))

    return <NavigateList itemAry={itemAry} />
  }
}
