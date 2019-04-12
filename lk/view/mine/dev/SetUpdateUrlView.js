import React, {Component} from 'react'
import {
  Text,
  View,
  AsyncStorage,
  TextInput
} from 'react-native'
import {
  Card, CardItem, Button
} from 'native-base'
import ScreenWrapper from '../../common/ScreenWrapper'

export default class SetUpdateUrlView extends ScreenWrapper {
  constructor (props) {
    super(props)
    this.state = {}
  }

  async componentDidMount () {
    const updateUrlBase = await AsyncStorage.getItem('updateUrlBase')
    // console.log({updateUrlBase})
    this.setState({
      updateUrlBase
    })
  }
  save = async () => {
    // console.log(this.t)
    await AsyncStorage.setItem('updateUrlBase', this.t)
    const updateUrlBase = await AsyncStorage.getItem('updateUrlBase')
    this.setState({
      updateUrlBase
    })
  }

  subRender () {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Card style={{justifyContent: 'center', alignItems: 'center', padding: 20, margin: 20, width: '90%'}}>
          <Text>{this.state.updateUrlBase || '没有设置'}</Text>
        </Card>
        <Card style={{width: '90%', marginTop: 40}}>
          <CardItem header bordered>
            <Text>设置自定义更新网址</Text>
          </CardItem>
          <CardItem bordered>
            <View style={{justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
              <TextInput style={{
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
                marginBottom: 5
              }} autoFocus onChangeText={t => {
                this.t = t.trim()
              }} onSubmitEditing={this.save}
              ></TextInput>
              <Button block info style={{width: 60, height: 40}} onPress={this.save}>
                <Text style={{color: 'white'}}>确认</Text>
              </Button>
            </View>

          </CardItem>
        </Card>
      </View>
    )
  }
}

SetUpdateUrlView.defaultProps = {}

SetUpdateUrlView.propTypes = {}
