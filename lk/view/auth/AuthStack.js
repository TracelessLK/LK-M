import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
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
import PasswordLoginView from './PasswordLoginView'
import ScanRegisterView from './ScanRegisterView'
import SelectUserView from './SelectUserView'
import RegisterView from './RegisterView'

const StackNavigator = createStackNavigator({
    ScanRegisterView,
    PasswordLoginView,
    SelectUserView,
    RegisterView
},{
})

export default StackNavigator
