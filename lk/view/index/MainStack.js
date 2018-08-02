import { createSwitchNavigator, createStackNavigator,createTabNavigator } from 'react-navigation'
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
    View,Modal,
} from 'react-native';
import PropTypes from 'prop-types'
import ContactView from '../contact/ContactView'
import AddContactView from '../contact/AddContactView'
import ChatView from '../chat/ChatView'
import MineView from '../mine/MineView'

const MainTab = createTabNavigator({
    ChatView,
    ContactView,
    MineView
})

const StackNavigator = createStackNavigator({
    MainTab,
    AddContactView,
})

export default StackNavigator
