

import React, { Component} from 'react';
import { Button,Image,TouchableOpacity,View,Text} from 'react-native';
import {TabNavigator } from 'react-navigation';
import {StackNavigator}from "react-navigation";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import TestView from './TestView'
const iconSize = 26

let style = {display:"flex",justifyContent:"center",alignItems:"center"}
function getTabLogo(title,focused,iconName){
    let color = focused?"#f9e160":"#d0d0d0"
    return(
        <View style={style}>
            <Icon name={iconName} size={iconSize}  color={color}/>
            <Text style={{fontSize:10, color}}>{title}</Text>
        </View>
    )
}



const MainTabs = TabNavigator({
    tab1: {
        screen: TestView,
        navigationOptions: {
            tabBarLabel: '消息',
            title:'消息',

            // tabBarIcon: ({ tintColor, focused }) =>{
            //     return getTabLogo('通讯录',focused,"table-of-contents" )
            // }
        }
    },
    }, {
        // initialRouteName: routeName ,
        swipeEnabled: false,
        lazy:false,
        animationEnabled:false,
        headerMode:"screen",
        tabBarPosition: 'bottom',
        tabBarOptions:
            {
                activeTintColor:'#f9e160',
                inactiveTintColor: '#d0d0d0',
                showIcon: true,
                style: {
                    backgroundColor:'#434343',
                    height:50
                },
                labelStyle: {
                    fontSize: 12,
                },
                indicatorStyle: {
                    height:0,
                },
                showLabel:false
            }
    }
);
let MainStack = StackNavigator({
    MainTabView: {
        screen: MainTabs,
        navigationOptions:{

        }
    },
    TestView: {
        screen: TestView,
        navigationOptions:{
            headerTitle: '版本信息'
        }
    },
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
