
import React, { Component } from 'react'
import {
  StyleSheet,
  View, ActivityIndicator,
  AsyncStorage
} from 'react-native'
import DataSource from '../../store/RNSqlite'

const {PushUtil} = require('@external/common')

const {getAPNDeviceId} = PushUtil
const {engine} = require('@lk/LK-C')
const UserManager = engine.get('UserManager')



let Application = engine.getApplication()
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
      await lkApplication.start(DataSource, Application.PLATFORM_RN)
      console.log(`loading db: ${(Date.now() - start) / 1000} s`)
      let routerName
      const currentUser = lkApplication.getCurrentUser()
      const venderDid = await getAPNDeviceId()
      console.log(`getAPNDeviceId: ${(Date.now() - start) / 1000} s`)

      if (currentUser) {
        routerName = 'MainStack'
      } else {
        const userAry = await UserManager.asyGetAll()
        console.log(`asyGetAllUser: ${(Date.now() - start) / 1000} s`)

        const {length} = userAry

        if (length === 0) {
          routerName = 'ScanRegisterView'
        } else if (length === 1) {
          lkApplication.setCurrentUser(userAry[0], venderDid)
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
            lkApplication.setCurrentUser(JSON.parse(user), venderDid)

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
          {/* <Image resizeMode='contain' style={{width:200}} source={require('../../image/1024x1024.png')}/> */}
          <ActivityIndicator size='large'/>
        </View>
      )
    }
}
