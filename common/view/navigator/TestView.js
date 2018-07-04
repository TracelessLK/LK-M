import React, {Component} from 'react';
import {
    AsyncStorage,
    NativeModules,
    Platform,
    StyleSheet, Text,
    View,
} from 'react-native';

export default class TestView extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = () => {

    }

    componentWillUnmount = () => {
    }


    componentWillUnmount = () => {

    }

    render() {
        return (
            <View>
                <Text>
                    test
                </Text>
            </View>
        );
    }

}

