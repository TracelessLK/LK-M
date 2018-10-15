
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

export default class SelectUserView extends Component<{}> {
  static navigationOptions =() => {
    return {
      headerTitle: '请选择账户登录'
    }
  }
  constructor (props) {
    super(props)
    this.state = {}

  }

  componentDidMount () {
    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    const currentUser = lkApplication.getCurrentUser()
    const userAry = await userProvider.asyGetAll()
    const {length} = userAry
    console.log({userAry, currentUser})
    if (length !== 0) {

    }
  }

  render () {
    return (
      <View>
        <Text>
          selectUser
        </Text>
      </View>
    )
  }
}

SelectUserView.defaultProps = {

}

SelectUserView.propTypes = {

}
