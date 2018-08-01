import React, { Component } from 'react';

import CheckCodeView from "./CheckCodeView";
import SetPasswordView from "./SetPasswordView";
import {StackNavigator} from "react-navigation";
import ScanRegisterView from "./ScanRegisterView";
import RegisterView from "./RegisterView";


let MainStack = StackNavigator({
    ScanRegisterView: {
        screen: ScanRegisterView,
        navigationOptions:{
            headerTitle: 'LK'
        }
    },
    CheckCodeView: {
        screen: CheckCodeView,
        navigationOptions:{
            headerTitle: '管理员注册'
        }
    },
    SetPasswordView: {
        screen: SetPasswordView,
        navigationOptions:{
            headerTitle: '设置登录密码'
        }
    },
    RegisterView:{
        screen: RegisterView,
        navigationOptions:{
            headerTitle: '注册'
        }
    }



}, {
    transitionConfig:function transitionConfig(){
        return {
            screenInterpolator: sceneProps => {
                const { layout, position, scene } = sceneProps;
                const { index } = scene;
                const translateX = position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [layout.initWidth, 0, 0]
                });
                const opacity = position.interpolate({
                    inputRange: [index - 1, index - 0.99, index, index + 0.99, index + 1],
                    outputRange: [0, 1, 1, 0.3, 0]
                });
                return { opacity, transform: [{ translateX }] }
            }
        };
    }
});

//
export default <MainStack onNavigationStateChange={null}/>;
