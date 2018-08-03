
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
const lkStyle = require('../style')

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
    },
    getTabLogo(title,focused,iconName,iconSize=26){
        let color = focused?lkStyle.color.mainColor:"#a0a0a0"
        let style = {display:"flex",justifyContent:"center",alignItems:"center"}

        return(
            <View style={style}>
                <Icon name={iconName} size={iconSize}  color={color}/>
                <Text style={{fontSize:10, color}}>{title}</Text>
            </View>
        )
    }
}

Object.freeze(navigatorUtil)

module.exports = navigatorUtil
