
import React, { Component } from 'react'
import {
  View
} from 'react-native'
const {engine} = require('@lk/LK-C')

let Application = engine.getApplication()
const UserManager = engine.get('UserManager')
const lkApplication = Application.getCurrentApp()
const common = require('@external/common')
const {MessageList} = common
const {getAvatarSource} = require('../../util')

export default class SelectUserView extends Component<{}> {
  static navigationOptions =() => {
    return {
      headerTitle: '选择账户'
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      contentAry: []
    }
  }

  componentDidMount () {
    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    const {navigation} = this.props
    const currentUser = lkApplication.getCurrentUser()
    const userAry = await UserManager.asyGetAll()
    console.log({userAry, currentUser})
    const data = userAry.reduce((accumulator, ele) => {
      const {pic, id, name, serverIP, serverPort} = ele
      const obj = {
        image: getAvatarSource(pic),
        id,
        name: `${name}`,
        content: `IP地址: ${serverIP} 端口: ${serverPort}`,
        onPress: () => {
          navigation.navigate('PasswordLoginView', {user: ele})
        }
      }
      accumulator.push(obj)
      return accumulator
    }, [])
    this.setState({
      contentAry: <MessageList data={data}></MessageList>
    })
  }

  render () {
    return (
      <View style={{marginVertical: 20}}>
        {this.state.contentAry}
      </View>
    )
  }
}

SelectUserView.defaultProps = {

}

SelectUserView.propTypes = {

}
