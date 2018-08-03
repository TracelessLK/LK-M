

import React, { Component } from 'react';
import {
    AsyncStorage,
    NativeModules,
    Platform,
    StyleSheet, Text,
    View,
    AppState, PushNotificationIOS
} from 'react-native';
import LoginView from "../common/view/login/PassLoginView"
import MainView from "../common/view/navigator/MainView";
import LoginStack from './view/auth/LoginStack';
import {Toast} from "native-base";
const Application = require("../engine/Application")
const lkApplication = Application.getCurrentApp()
import LoadingView from '../common/view/LoadingView'
import EntryView from './view/index/EntryView'
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
    'Warning: isMounted(...) is deprecated in plain JavaScript React classes. Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks.',
    "Module RCTHotUpdate requires",
    "Method `jumpToIndex` is deprecated",
    "Module RNFetchBlob"
]);


export default class LKEntry extends Component<{}> {

    constructor(props){
        super(props);
    }



    componentWillUnmount=()=>{

    }





    render() {
        return (
            <EntryView></EntryView>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
