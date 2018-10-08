import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import React from 'react'
import {
  StatusBar, Image
} from 'react-native'
import ContactView from '../contact/ContactView'
import AddContactView from '../contact/AddContactView'
import FriendInfoView from '../contact/FriendInfoView'
import OrgView from '../contact/OrgView'
import ExternalView from '../contact/ExternalView'
import ChatView from '../chat/ChatView'
import RecentView from '../chat/RecentView'
import RequestView from '../contact/RequestView'
import AddGroupView from '../contact/AddGroupView'
import MineView from '../mine/MineView'
import DevView from '../mine/dev/DevView'
import InfoView from '../mine/dev/InfoView'
import BasicInfoView from '../mine/BasicInfoView'
import QrcodeView from '../mine/QrcodeView'
import UidView from '../mine/UidView'
import VersionView from '../mine/VersionView'
import RenameView from '../mine/RenameView'
const util = require('../util/navigatorUtil')
const style = require('../style')

const stackNavigatorConfig = {
  navigationOptions: {
    headerStyle: {
      backgroundColor: style.color.mainColor
    },
    headerTitleStyle: {
      color: 'white'
    },
    headerBackTitleStyle: {
      color: 'white'
    },
    headerBackground: (
      <StatusBar
        barStyle="light-content"
        backgroundColor={style.color.mainColor}
      />
    ),
    headerBackImage: (
      <Image style={{width: 30, height: 30}} source={require('../image/back-icon.png')}></Image>
    )
  }
}

const ChatTab = createStackNavigator({
  RecentView
}, stackNavigatorConfig)

const ContactTab = createStackNavigator({
  ContactView
}, stackNavigatorConfig)

const MineTab = createStackNavigator({
  MineView
}, stackNavigatorConfig)

const MainTab = createBottomTabNavigator({
  ChatTab: {
    screen: ChatTab,
    navigationOptions: {
      tabBarIcon: ({ focused }) => {
        return util.getTabLogo('消息', focused, 'message-outline', 24)
      }
    }
  },
  ContactTab: {
    screen: ContactTab,
    navigationOptions: {
      tabBarIcon: ({ focused }) => {
        return util.getTabLogo('通讯录', focused, 'table-of-contents')
      }
    }
  },
  MineTab: {
    screen: MineTab,
    navigationOptions: {
      tabBarIcon: ({ focused }) => {
        return util.getTabLogo('我', focused, 'account-outline')
      }
    }
  }

}, {
  tabBarOptions: {
    showLabel: false
  },
  lazy: false

})

const MainStack = createStackNavigator({
  MainTab: {
    screen: MainTab,
    navigationOptions: {
      header: null
    }
  },
  AddContactView,
  DevView,
  FriendInfoView,
  ChatView,
  OrgView,
  ExternalView,
  BasicInfoView,
  QrcodeView,
  UidView,
  VersionView,
  RenameView,
  InfoView,
  RequestView,
  AddGroupView
}, stackNavigatorConfig)

export default MainStack
