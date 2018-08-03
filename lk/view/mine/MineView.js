
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const lkStyle = require('../style')
const util = require('../util/navigatorUtil')


export default class MineStack extends Component<{}> {
    static navigationOptions =({ navigation, screenProps }) => {
        return {
            tabBarIcon: ({ tintColor, focused }) =>{
                return util.getTabLogo('我的',focused,"account-outline" )
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
               <Text>MineStack</Text>
           </View>
        )
    }

}

MineStack.defaultProps = {

}

MineStack.propTypes = {

}
