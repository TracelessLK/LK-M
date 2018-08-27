
import AuthStack from '../auth/AuthStack'
import MainStack from './MainStack'
import Loading from './Loading'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
const {ScanView} = require('@hfs/common')

const switchNavigator = createSwitchNavigator({
    Loading,
    MainStack,
    AuthStack ,
})


const EntryView = createStackNavigator({
    SwitchView:switchNavigator,
    ScanView
},{
    headerMode:"none"
})
export default EntryView
