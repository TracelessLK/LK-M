
import React, { Component } from 'react'
import {
  View,
  ActivityIndicator
} from 'react-native'
import PropTypes from 'prop-types'

const style = require('../view/style')


export default class My extends Component<{}> {
  constructor(props) {
    super(props)
    this.state = {
      content: null
    }
  }

  componentDidMount() {
    this.hasMounted = true

    setTimeout(() => {
      if (this.hasMounted) {
        this.setState({
          content: (
            <ActivityIndicator size='large'/>
          )})
      }
    }, this.props.delay)
  }

  componentDidUpdate() {
  }


  componentWillUnmount() {
    this.hasMounted = false
  }

  render() {
    return (
      <View style={style.allCenter}>
        {this.state.content}
      </View>
    )
  }
}

My.defaultProps = {
  delay: 1000
}

My.propTypes = {
  delay: PropTypes.number
}
