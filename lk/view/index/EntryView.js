
import AuthStack from '../auth/AuthStack'
import NotifyView from '../external/NotifyView'
import MainStack from './MainStack'
import Loading from './Loading'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
const {ScanView} = require('@ys/react-native-collection')

const switchNavigator = createSwitchNavigator({
  Loading,
  MainStack,
  AuthStack
})

const withHeader = createStackNavigator({
  NotifyView
}, {
  headerMode: 'float'
})
const EntryView = createStackNavigator({
  SwitchView: switchNavigator,
  ScanView: {
    screen: ScanView,
    path: 'scan'
  },
  NotifyView: {
    screen: withHeader
  }
}, {
  headerMode: 'none'
})
export default EntryView
