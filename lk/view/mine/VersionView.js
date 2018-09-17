import React, {Component} from 'react'

import {
  Alert, AlertIOS, Clipboard, Dimensions, View, Linking
} from 'react-native'
import { Avatar, Card, List, ListItem} from 'react-native-elements'
import {Button, Icon, Text, Toast, Spinner} from 'native-base'
const versionLocal = require('../../../package.json').version
const config = require('../../config')
const common = require('@external/common')
const {SearchBar, commonUtil, updateUtil} = common
const {debounceFunc} = commonUtil
const lkApp = require('../../LKApplication').getCurrentApp()

export default class VersionView extends Component<{}> {
    static navigationOptions = () => {
      return {
        headerTitle: '版本信息'
      }
    }

    constructor (props) {
      super(props)
      this.state = {}
      this.user = lkApp.getCurrentUser()
    }

    render () {
      const {width} = Dimensions.get('window')
      const style = {
        itemStyle: {
          fontSize: width / 28,
          marginVertical: 10
        }
      }

      return (
        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 50, width: '100%'}}>

          <Card style={{}}>
            <View style={{padding: 50, flexDirection: 'column', width: '90%', marginHorizontal: 5, marginVertical: 20, justifyContent: 'center', alignItems: 'center'}}>
              <Text selectable style={style.itemStyle} onPress={() => {
                this.count++
                if (this.count > 10) {
                  // config.isDevMode = true
                  Alert.alert('你已进入开发模式')
                }

                setTimeout(() => {
                  this.count = 0
                }, 1000 * 10)
              }} >

                {config.isPreviewVersion ? `预览版本:${versionLocal}(${config.previewVersion})` : `当前版本:${versionLocal}`}
              </Text>
              <View style={{marginVertical: 20}}>
                <Button iconLeft info disabled={this.state.checking} onPress={debounceFunc(() => {
                  this.setState({
                    checking: true
                  })

                  const afterCheck = () => {
                    this.setState({
                      checking: false
                    })
                    return Promise.resolve()
                  }

                  updateUtil.checkUpdateGeneral({
                    uid: this.user.id,
                    name: this.user.name,
                    beforeUpdate: afterCheck,
                    noUpdateCb: () => {
                      afterCheck().then(() => {
                        Toast.show({
                          text: '当前已是最新版本',
                          position: 'top',
                          type: 'success',
                          duration: 3000
                        })
                      })
                    },
                    errorCb: () => {
                      afterCheck().then(() => {
                        Toast.show({
                          text: '检查更新出错了',
                          position: 'top',
                          type: 'error',
                          duration: 3000
                        })
                      })
                    }
                  })
                })
                }>
                  <Icon name='refresh' />
                  <Text>检查更新</Text>
                </Button>
              </View>
            </View>
          </Card>
          {this.state.checking ? <Spinner color='blue' style={{position: 'absolute', top: '10%'}}/> : null}

        </View>)
    }
}

VersionView.defaultProps = {}

VersionView.propTypes = {}
