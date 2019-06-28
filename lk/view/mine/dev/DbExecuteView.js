import React from 'react'
import {
  StyleSheet, TextInput, View, ScrollView
} from 'react-native'
import {Button, Icon, Text} from 'native-base'
import ScreenWrapper from '../../common/ScreenWrapper'

export default class DbExecuteView extends ScreenWrapper {
    static navigationOptions =() => {
      return {
        headerTitle: 'SQL执行'
      }
    }

    constructor (props) {
      super(props)
      this._onChangeText = this._onChangeText.bind(this)
      this.state = {
        textValue: ""
      }
    }

    _onChangeText(inputData) {
      //把获取到的内容，设置给showValue
      this.setState({textValue: inputData})
    }

    subRender () {
      return (

        <ScrollView style={{}}
          contentContainerStyle={{marginVertical: 20, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', flex: 1, width: '100%'}}>
            <View>
              <Button>
                <Icon name='refresh' />
                <Text>清空</Text>
              </Button>
            </View>
            <View>
              <Button iconLeft info onPress={() => {
                this.props.navigation.navigate('DbExecuteDataView', {
                  sql: this.state.textValue
                })
              }}>
                <Icon name='refresh' />
                <Text>执行</Text>
              </Button>
            </View>
          </View>
          <View style={styles.viewStyle}>
            <TextInput
              editable
              style={styles.inputStyle}
              onChangeText={this._onChangeText}
                />
          </View>
        </ScrollView>)
    }
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center', flexDirection: 'row', alignItems: 'center'
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    fontSize: 16,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 5,
    marginHorizontal: 5,
    minHeight: 40,
    backgroundColor: '#f0f0f0',
    marginBottom: 5,
    height: 100
  }
})
