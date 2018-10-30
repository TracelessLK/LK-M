import React, {Component} from 'react'
import {
  Text,
  View,
  AsyncStorage
} from 'react-native'
import {
  Card
} from 'native-base'
import PropTypes from 'prop-types'

export default class SetUpdateUrlView extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {}
  }

  async componentDidMount () {
    const updateUrlBase = await AsyncStorage.getItem('updateUrlBase')
    console.log({updateUrlBase})
    this.setState({
      updateUrlBase
    })
  }

  componentWillUnmount () {

  }

  render () {
    return (
      <View>
        <Card style={{justifyContent: 'center', alignItems: 'center', padding: 20, margin: 20}}>
          <Text>{this.state.updateUrlBase || '没有设置'}</Text>
        </Card>
        <View>

        </View>
      </View>
    )
  }
}

SetUpdateUrlView.defaultProps = {}

SetUpdateUrlView.propTypes = {}
