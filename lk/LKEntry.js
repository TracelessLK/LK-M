

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
import LoginStack from './view/login/LoginStack';
import {Toast} from "native-base";
const Application = require("../engine/Application")
const lkApplication = Application.getCurrentApp()


const loginHandler = lkApplication.getLoginHandler()
const AppUtil  = require('./AppUtil')

export default class LKEntry extends Component<{}> {

    constructor(props){
        super(props);
        AppUtil.setApp(this);
        this.state={
            content:null
        };
    }



    componentWillUnmount=()=>{
    }


    componentWillUnmount =()=> {

    }

    reset=()=>{
        this.setState({reset:true});

    }

    render() {


        return (
            <View style={styles.container}>
                {this.state.content}
            </View>
        );
    }

    componentDidMount(){
        this.asyncRender()

    }
    async asyncRender(){

        let content=null;
        const currentUser = lkApplication.getCurrentUser()
        //TODO:password login
        if(currentUser){
            content

        }else{
            const userProvider = lkApplication.getLKUserProvider();

            const userAry = await userProvider.asyGetAll()
            const {length} = userAry

            if(length === 0){
                content= LoginStack
            }else if(length ===1){
                await lkApplication.setCurrentUser(userAry[0])
                content = <MainView  />
            }else if(length > 1){
                //TODO
            }

        }


        this.setState({
            content
        })

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
