
import React, { Component } from 'react';
import {
    Alert,
    AsyncStorage,
    Button,
    NativeModules,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,Modal,
} from 'react-native';
import PropTypes from 'prop-types'


export default class RecentView extends Component<{}> {
    static navigationOptions =() => {
        return {
            headerTitle:"消息"
        }
    }
    constructor(props){
        super(props);
        this.state={};
    }

    componentDidMount(){

    }

    componentDidUpdate(){
    }


    componentWillUnmount(){

    }

    render() {
        return (
           <View>
               <Text>RecentView</Text>
           </View>
        )
    }

}

RecentView.defaultProps = {

}

RecentView.propTypes = {

}
