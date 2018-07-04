

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
import ScanRegisterView from '../common/view/register/ScanRegisterView';
import {Toast} from "native-base";
const AppTemplate = require("../common/AppTemplate")
const loginHandler = AppTemplate.getLoginHandler()


export default class LKAPP extends Component<{}> {

    constructor(props){
        super(props);
        this.state={};
    }

    componentDidMount=()=>{

    }

    componentWillUnmount=()=>{
    }


    componentWillUnmount =()=> {

    }

    render() {
        let content=null;
        if(loginHandler.needLogin()){
            if(loginHandler.getLogin()){
                content = <MainView  />
            }else{
                content=<LoginView ></LoginView>;

            }
        }else{
            content=<ScanRegisterView ></ScanRegisterView>
        }

        return (
            <View style={styles.container}>
                {content}
            </View>
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
