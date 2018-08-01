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

const StackNavigator = createStackNavigator({
    PasswordLoginView,
    ScanRegisterView,
    SelectUserView
})

export default StackNavigator
