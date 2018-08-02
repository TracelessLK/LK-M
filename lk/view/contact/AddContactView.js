
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


export default class AddContactView extends Component<{}> {

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
               <Text>AddContactView</Text>
           </View>
        )
    }

}

AddContactView.defaultProps = {
    
}

AddContactView.propTypes = {

}
