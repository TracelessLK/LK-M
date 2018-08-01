import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import TestView from "./TestView";


const navigatorUtil = {
    get type(){
        return {
            'stack':1,
            'tab':2
        }
    },
    getNavigator(option){
        const {type,screenAry} = option
        let result
        const obj = {}

        for(let screen of screenAry){
            obj[screen.name] = screen
        }

        if(type === this.type.stack){
            result = createStackNavigator()
        }

    }
}

Object.freeze(navigatorUtil)
module.exports = navigatorUtil
