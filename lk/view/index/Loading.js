
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  AsyncStorage, Image
} from 'react-native'
//import DataSource from '../../store/RNSqlite'

const {PushUtil} = require('@external/common')

const {getAPNDeviceId} = PushUtil
const {engine} = require('@lk/LK-C')

const UserManager = engine.UserManager
const logo = require('../image/logo.png')

const Application = engine.Application
const lkApplication = Application.getCurrentApp()

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default class Loading extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {}
  }

    _bootstrapAsync = async () => {
    // 准备数据库
      const start = Date.now()
      let routerName
      const currentUser = lkApplication.getCurrentUser()
      const venderDid = await getAPNDeviceId()

      if (currentUser) {
        routerName = 'MainStack'
      } else {
        const userAry = await UserManager.asyGetAll()
        const {length} = userAry

        if (length === 0) {
          routerName = 'ScanRegisterView'
        } else if (length === 1) {
          lkApplication.setCurrentUser(userAry[0], venderDid, true)
          routerName = 'MainStack'
        } else if (length > 1) {
          // fixme: AsyncStorage 始终无法getItem
          const user = await Promise.race([
            AsyncStorage.getItem('user'),
            new Promise(res => {
              setTimeout(() => {
                res(null)
              }, 1000 * 2)
            })
          ])
          console.log(`AsyncStorage Get User: ${(Date.now() - start) / 1000} s`)

          if (user) {
            lkApplication.setCurrentUser(JSON.parse(user), venderDid, true)

            routerName = 'MainStack'
          } else {
            routerName = 'SelectUserView'
          }
        }
      }
      this.props.navigation.navigate(routerName)
    }

    componentDidMount () {
      this._bootstrapAsync()
    }

    render () {
      return (
        <View style={styles.container}>
          <Image resizeMode='contain' style={{width: 200}} source={logo}/>
          {/*<ActivityIndicator size='large'/>*/}
        </View>
      )
    }
}
