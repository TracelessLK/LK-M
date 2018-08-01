
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
    View,Modal,ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'

function f(sth:string){

}
f(23)
const navigatorUtil = {

    getNavigator(option:number){
        const {getRouterName,MainStack,AuthStack} = option

        class Loading extends Component<{}> {
            constructor(props){
                super(props);
                this.state={};
                this._bootstrapAsync();
            }

            componentDidMount(){

            }

            componentDidUpdate(){
            }


            componentWillUnmount(){

            }

            _bootstrapAsync = async () => {
                const routerName = await getRouterName()
                this.props.navigation.navigate(routerName);
            }

            render() {
                return (
                    <View style={styles.container}>
                        <ActivityIndicator />
                    </View>
                )
            }

        }

        const SwitchStack = createSwitchNavigator(
            {
                Loading,
                MainStack,
                AuthStack ,
            },
            {
                initialRouteName: 'Loading',
            }
        );

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                alignItems:"center",
                justifyContent:"center"
            },
        });
        return SwitchStack
    }
}

Object.freeze(navigatorUtil)

module.exports = navigatorUtil
