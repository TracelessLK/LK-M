
import React, { Component } from 'react'
import {
  Alert,
  AsyncStorage,
  Button,
  NativeModules,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View, Modal
} from 'react-native'
import PropTypes from 'prop-types'
import userProvider from '../../logic/provider/LKUserProvider'
const Application = require('../../LKApplication')
const lkApplication = Application.getCurrentApp()
const common = require('@external/common')
const {List, MessageList} = common
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
    const userAry = await userProvider.asyGetAll()
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
