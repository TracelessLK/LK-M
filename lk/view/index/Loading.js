
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
    View,Modal,ActivityIndicator,Image
} from 'react-native';
import PropTypes from 'prop-types'
import userProvider from "../../logic/provider/LKUserProvider";
const Application = require("../../LKApplication")
const lkApplication = Application.getCurrentApp()

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:"center",
        justifyContent:"center"
    },
});

export default class Loading extends Component<{}> {
    constructor(props){
        super(props);
        this.state={};
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        let routerName
        const currentUser = lkApplication.getCurrentUser()
        console.log(1)

        if(currentUser){
            routerName = 'MainStack'
        }else{
            console.log(4)

            const userAry = await userProvider.asyGetAll()
            console.log(5)

            const {length} = userAry

            if(length === 0){
                routerName = 'ScanRegisterView'
            }else if(length ===1){
                console.log(2)

                lkApplication.setCurrentUser(userAry[0])

                routerName = 'MainStack'
            }else if(length > 1){
                routerName = 'SelectUserView'
            }
        }
        console.log(3)

        this.props.navigation.navigate(routerName);
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<Image resizeMode='contain' style={{width:200}} source={require('../../image/1024x1024.png')}/>*/}
                <ActivityIndicator size='large'/>

            </View>
        )
    }

}
