import React, {Component} from 'react'
import {
  TextInput
} from 'react-native'
import PropTypes from 'prop-types'

const {FuncUtil} = require('@ys/vanilla')

const {debounceFunc} = FuncUtil
const MAX_INPUT_HEIGHT = 300
const uuid = require('uuid')

export default class TextInputWrapper extends Component<{}> {
  constructor (props) {
    super(props)
    this.minHeight = 35
    this.state = {
      height: this.minHeight,
      autoFocus: false,
      defaultValue: ''
    }
  }

  reload (defaultValue = '') {
    this.setState({key: uuid(), autoFocus: true, defaultValue})
  }

  render () {
    const {onChangeText, onSubmitEditing} = this.props
    return (
      <TextInput multiline ref="text"
        {...this.props.textInputProp}
        style={{flex: 1,
          color: 'black',
          fontSize: 16,
          paddingHorizontal: 4,
          borderWidth: 1,
          borderColor: '#d0d0d0',
          borderRadius: 5,
          marginHorizontal: 5,
          minHeight: this.minHeight,
          backgroundColor: '#f0f0f0',
          marginBottom: 5,
          height: this.state.height}}
        blurOnSubmit={false} returnKeyType="send" enablesReturnKeyAutomatically
        underlineColorAndroid='transparent' defaultValue={this.state.defaultValue} onSubmitEditing={debounceFunc(onSubmitEditing)}
        onChangeText={onChangeText} onContentSizeChange={(event) => {
          let heightContent = event.nativeEvent.contentSize.height
          if (heightContent < this.minHeight) {
            heightContent = this.minHeight
          } else {
            heightContent += 10
          }
          if (this.state.height !== heightContent) {
            if (heightContent > MAX_INPUT_HEIGHT) {
              heightContent = MAX_INPUT_HEIGHT
            }
            this.setState({height: heightContent})
          }
        }} key={this.state.key} autoFocus={this.state.autoFocus} />
    )
  }
}

TextInputWrapper.defaultProps = {}

TextInputWrapper.propTypes = {
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  textInputProp: PropTypes.object
}
