

import React, { Component } from 'react';
import {
    AsyncStorage,
    NativeModules,
    Platform,
    StyleSheet, Text,
    View,
} from 'react-native';
import MainTab from "./MainTab"

export default class MainView extends Component<{}> {

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
        return MainTab;
    }

}

