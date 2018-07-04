

import React, { Component } from 'react';
import {
    AsyncStorage,
    NativeModules,
    Platform,
    StyleSheet, Text,
    View,
} from 'react-native';

export default class PassLoginView extends Component<{}> {

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
        return (
            <View>
                <Text>
                    PassLoginView
                </Text>
            </View>
        );
    }

}

