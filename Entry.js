
import React, { Component } from 'react';
import {
    Alert,
    AsyncStorage,
    Linking,
    NativeModules,Platform,
    StyleSheet,Text,View,PushNotificationIOS,AppState
} from 'react-native';
import entryUtil from "./common/util/entryUtil"
import {Root, Spinner, Toast} from "native-base"
import {} from './Manifest'

import LKEntry from './lk/LKEntry'
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

entryUtil.init()

export default class Entry extends Component<{}> {
    constructor(props){
        super(props);
    }

    componentWillMount =()=> {

    }

    componentWillUnmount =()=> {

    }

    render() {

        return (
            <Root>
                <View style={styles.container}>
                    <LKEntry></LKEntry>
                </View>
            </Root>

        );
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
