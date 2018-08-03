import { createSwitchNavigator, createStackNavigator,createBottomTabNavigator } from 'react-navigation'
import React, { Component } from 'react';
import {
    Alert,
    AsyncStorage,
    Button,
    NativeModules,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,Modal,StatusBar,Image
} from 'react-native';
import PropTypes from 'prop-types'
import ContactView from '../contact/ContactView'
import AddContactView from '../contact/AddContactView'
import ChatView from '../chat/ChatView'
import MineView from '../mine/MineView'
import DevView from '../mine/dev/DevView'

const MainTab = createBottomTabNavigator({
    ChatView,
    ContactView:{
        screen:ContactView,
        navigationOptions:{
            title:"000",
            headerTitle:"dsfdf",
            tabBarLabel:'通讯录',
            headerTitleStyle:{
                color:"red"
            }
        }
    },
    MineView,

},{
    headerTitle:"dfsf",
    tabBarOptions:{
        showLabel:false

    }
})
const style = {
    style1:{
        color:"white"
    }
}
const StackNavigator = createStackNavigator({
    MainTab,
    AddContactView:{
        screen:AddContactView,
        navigationOptions:{
            headerTitle:"添加外部联系人",
            headerTitleStyle:style.style1,
            headerBackTitleStyle:style.style1,

        }
    },
    DevView
},{
    navigationOptions:{
        headerStyle:{
            backgroundColor:"#5077AA"
        },
        headerTitleStyle:{
            color:"white"
        },
        headerBackTitleStyle:{
            color:"white"
        },
        headerBackground:(
            <StatusBar
                barStyle="light-content"
                backgroundColor="red"
            />
        ),
        headerBackImage:(
            <Image style={{width:30,height:30}} source={require('../../image/back-icon.png')}></Image>
        )
    }
})

export default StackNavigator
