import { createSwitchNavigator, createStackNavigator } from 'react-navigation'

import AuthStack from '../auth/AuthStack'
import NotifyView from '../external/NotifyView'
import MainStack from './MainStack'
import Loading from './Loading'
import ScanView from '../common/ScanView'

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
