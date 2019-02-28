import React, { Component } from 'react'
import {
  Text,
  View,
  Modal, ScrollView, TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'

export default class TransModal extends Component<{}> {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  show() {
    this.setState({
      visible: true
    })
  }

  hide() {
    this.setState({
      visible: false
    })
  }

  render() {
    return (
      <Modal transparent visible={this.state.visible} animationType="fade" onRequestClose={this.hide}>
        <View style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(60,60,60, 0.8)'
        }}
        >
          <View style={{
            backgroundColor: 'white', padding: 20, borderRadius: 10, width: '85%', maxHeight: '80%'
          }}
          >
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {this.props.title}
              </Text>
            </View>
            {this.props.useScrollView
              ? (
                <ScrollView>
                  {this.props.children}
                </ScrollView>
              )
              : (
                <View>
                  {this.props.children}
                </View>
              )
            }

            <View style={{ borderWidth: 1, borderColor: '#f0f0f0', marginVertical: 20 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={{ marginHorizontal: 20 }}
                onPress={() => {
                  this.hide()
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  取消
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                this.props.confirm()
                this.hide()
              }}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                  确定
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

TransModal.defaultProps = {
  title: '',
  confirm: () => {

  },
  useScrollView: false
}

TransModal.propTypes = {
  title: PropTypes.string,
  confirm: PropTypes.func,
  useScrollView: PropTypes.bool
}
