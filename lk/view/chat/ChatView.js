
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
const util = require('../util/navigatorUtil')


export default class ChatView extends Component<{}> {

    static navigationOptions =({ navigation, screenProps }) => {
        return {
            tabBarIcon: ({ tintColor, focused }) =>{
                return util.getTabLogo('消息',focused,"message-outline" )
            }
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
               <Text>ChatView</Text>
           </View>
        )
    }

}

ChatView.defaultProps = {

}

ChatView.propTypes = {

}
