
import React, { Component } from 'react'
import {
  View
} from 'react-native'
import ActivityIndicator from '../widget/ActivityIndicator'
import PropTypes from 'prop-types'
const style = require('./style')

export default class LoadingView extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {
      content: null,
      loading: true
    }
  }

  render () {
    return (
      <View style={style.allCenter}>
        {this.props.loading ? (
          <ActivityIndicator/>
        ) : this.props.content}
      </View>
    )
  }
}

LoadingView.defaultProps = {
  loading: true
}

LoadingView.propTypes = {
  loading: PropTypes.bool,
  content: PropTypes.element
}
