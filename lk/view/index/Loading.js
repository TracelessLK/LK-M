
import React, { Component } from 'react'
import {
  StyleSheet,
  View, ActivityIndicator,
  AsyncStorage
} from 'react-native'
import userProvider from '../../logic/provider/LKUserProvider'
const Application = require('../../LKApplication')
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
      let routerName
      const currentUser = lkApplication.getCurrentUser()

      if (currentUser) {
        routerName = 'MainStack'
      } else {
        const userAry = await userProvider.asyGetAll()
        const {length} = userAry

        if (length === 0) {
          routerName = 'ScanRegisterView'
        } else if (length === 1) {
          lkApplication.setCurrentUser(userAry[0])
          routerName = 'MainStack'
        } else if (length > 1) {
          if (__DEV__) {
            const user = await AsyncStorage.getItem('user')

            if (user) {
              lkApplication.setCurrentUser(JSON.parse(user)).catch(err => {
                throw err
              })

              routerName = 'MainStack'
            } else {
              routerName = 'SelectUserView'
            }
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
