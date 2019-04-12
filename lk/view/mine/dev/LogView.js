import React, { Component} from 'react'
import {
  View, ScrollView
} from 'react-native'
import {Button, Icon, Text} from 'native-base'
import {Card} from 'react-native-elements'
import ScreenWrapper from '../../common/ScreenWrapper'

const RNFS = require('react-native-fs')

export default class LogView extends ScreenWrapper {
  static navigationOptions =({navigation}) => {
    return {
      headerTitle: (navigation.state.params.type || '')
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      result: ''
    }
    this.path = this.props.navigation.state.params.path
  }

  componentDidMount () {
    this.reload()
  }

    reload = () => {
      RNFS.exists(this.path).then(result => {
        if (result) {
          RNFS.readFile(this.path).then(resultInner => {
            this.setState({
              result: resultInner
            })
          })
        }
      })
    }

  subRender () {
      return (
        <ScrollView style={{}}
          contentContainerStyle={{marginVertical: 20, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', flex: 1, width: '100%'}}>
            <View>
              <Button iconLeft info onPress={() => {
                RNFS.writeFile(this.path, '', 'utf8')
                  .then(() => {
                    this.reload()
                  })
                  .catch((err) => {
                    console.log(err.message)
                  })
              }}>
                <Icon name='refresh' />
                <Text>清空</Text>
              </Button>
            </View>
            <View>
              <Button iconLeft info onPress={() => {
                this.reload()
              }}>
                <Icon name='refresh' />
                <Text>刷新</Text>
              </Button>
            </View>

          </View>
          <Card title="" style={{flex: 1, width: '90%'}}>
            <Text>
              {this.state.result || '无记录'}
            </Text>
          </Card>

        </ScrollView>)
    }
}
