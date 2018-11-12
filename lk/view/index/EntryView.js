
import AuthStack from '../auth/AuthStack'
import MainStack from './MainStack'
import Loading from './Loading'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
const {ScanView} = require('@ys/react-native-collection')

const switchNavigator = createSwitchNavigator({
  Loading,
  MainStack,
  AuthStack
})

const EntryView = createStackNavigator({
  SwitchView: switchNavigator,
  ScanView: {
    screen: ScanView,
    path: 'scan'
  }
}, {
  headerMode: 'none'
})
export default EntryView
