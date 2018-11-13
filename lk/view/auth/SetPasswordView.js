import React, {Component} from 'react'
import {
  Alert,
  Text,
  View
} from 'react-native'
import {Input, Item, Button, Label, Toast} from 'native-base'
const {debounceFunc} = require('../../../common/util/commonUtil')

export default class CheckCodeView extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {}
  }

    onChangeText = (t) => {
      this.text = t ? t.trim() : ''
    }
    render () {
      return (
        <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <View style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: 15, width: '95%'}}>
            <Item floatingLabel >
              <Label>请设置登录密码</Label>
              <Input ref='input' onChangeText={this.onChangeText}></Input>
            </Item>
          </View>
          <View>
            <Button ref='button' iconLeft info style={{width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}

              onPress={debounceFunc(() => {
                if (!this.text) {
                  Toast.show({
                    text: '请设置登录密码',
                    position: 'top',
                    type: 'warning',
                    duration: 3000
                  })
                } else {
                  const obj = this.props.navigation.state.params.obj
                  obj.checkCode = this.text
                  const {url} = obj
                  fetch(`${url}/api/member/${obj.action}`, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(obj)
                  }).then(response => {
                    (async () => {
                      const result = await response.json()
                      const {errorMsg} = result
                      if (errorMsg) {
                        Alert.alert('提示', errorMsg)
                      } else {
                        this.props.navigation.goBack()
                      }
                    })()
                  }).catch(err => {
                    console.log(err)
                  })
                }
              })}>
              <Text style={{color: 'white'}}>保存</Text>
            </Button>
          </View>

        </View>
      )
    }
}

CheckCodeView.defaultProps = {}

CheckCodeView.propTypes = {}
