import LoginStack from "../auth/LoginStack";

const navigatorUtil = require('../util/navigatorUtil')
import AuthStack from '../auth/AuthStack'
import MainStack from './MainStack'
import Loading from './Loading'
const Application = require("../../LKApplication")
const lkApplication = Application.getCurrentApp()
import userProvider from '../../logic/provider/LKUserProvider'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
const manifest = require('../../../Manifest')

const switchNavigator = createSwitchNavigator({
    Loading,
    MainStack,
    AuthStack ,
})


const EntryView = createStackNavigator({
    SwitchView:switchNavigator,
    ScanView:manifest.get("ScanView")
},{
    headerMode:"none"
})
export default EntryView
