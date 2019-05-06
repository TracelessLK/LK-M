import React, {Component} from 'react'
import {
  Text,
  View
} from 'react-native'

const lkApplication = require('../../../lk/LKApplication').getCurrentApp()

export default class TestView extends Component<{}> {
  constructor(props) {
    super(props)
    this.state = {}
  }

    componentDidMount = () => {
    }


    componentWillUnmount = () => {
    }


    componentWillUnmount = () => {

    }

    render() {
      const user = lkApplication.getCurrentUser()

      return (
        <View>
          <Text>
            {JSON.stringify(user)}

          </Text>
        </View>
      )
    }
}
