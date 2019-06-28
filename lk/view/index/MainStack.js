import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import React from 'react'
import {
  StatusBar, Image
} from 'react-native'

import ContactView from '../contact/ContactView'
import AddContactView from '../contact/AddContactView'
import FriendInfoView from '../contact/FriendInfoView'
import GroupInfoView from '../contact/GroupInfoView'
import AddGroupMemberView from '../contact/AddGroupMemberView'
import OrgView from '../contact/OrgView'
import ExternalView from '../contact/ExternalView'
import ChatView from '../chat/ChatView'
import RecentView from '../chat/RecentView'
import ConnectionFailView from '../chat/ConnectionFailView'
import ReadStateView from '../chat/ReadStateView'
import RequestView from '../contact/RequestView'
import AddGroupView from '../contact/AddGroupView'
import GroupRenameView from '../contact/GroupRenameView'
import MineView from '../mine/MineView'
import DevView from '../mine/dev/DevView'
import LogView from '../mine/dev/LogView'
import SetUpdateUrlView from '../mine/dev/SetUpdateUrlView'
import InfoView from '../mine/dev/InfoView'
import TestView from '../mine/dev/TestView'
import TableListView from '../mine/dev/TableListView'
import DbView from '../mine/dev/DbView'
import DbViewTable from '../mine/dev/DbViewTable'
import DbExecuteView from '../mine/dev/DbExecuteView'
import DbExecuteDataView from '../mine/dev/DbExecuteDataView'
import TestView3 from '../mine/dev/testView/View3'
import TestView1 from '../mine/dev/testView/View1'
import BasicInfoView from '../mine/BasicInfoView'
import QrcodeView from '../mine/QrcodeView'
import UidView from '../mine/UidView'
import VersionView from '../mine/VersionView'
import RenameView from '../mine/RenameView'
import MsgBadge from '../chat/MsgBadge'

const {getTabLogo} = require('../../util')
const style = require('../style')
const backImg = require('../image/back-icon.png')

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
      <Image style={{width: 30, height: 30}} source={backImg}></Image>
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
      tabBarIcon: (option) => {
        // console.log({option})
        const { focused } = option
        return getTabLogo('消息', focused, 'message-outline', 24, <MsgBadge></MsgBadge>)
      }
    }
  },
  ContactTab: {
    screen: ContactTab,
    navigationOptions: {
      tabBarIcon: ({ focused }) => {
        return getTabLogo('通讯录', focused, 'table-of-contents')
      }
    }
  },
  MineTab: {
    screen: MineTab,
    navigationOptions: {
      tabBarIcon: ({ focused }) => {
        return getTabLogo('我', focused, 'account-outline')
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
  // todo:  path not working
  ExternalView: {
    screen: ExternalView,
    path: 'external'
  },
  BasicInfoView,
  QrcodeView,
  UidView,
  VersionView,
  RenameView,
  InfoView,
  RequestView,
  AddGroupView,
  GroupInfoView,
  GroupRenameView,
  ConnectionFailView,
  ReadStateView,
  AddGroupMemberView,
  SetUpdateUrlView,
  LogView,
  TestView,
  TestView3,
  TestView1,
  DbView,
  DbViewTable,
  TableListView,
  DbExecuteDataView,
  DbExecuteView
}, stackNavigatorConfig)

export default MainStack
