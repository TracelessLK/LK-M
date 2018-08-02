import React, { Component } from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Platform
} from 'react-native';
const {debounceFunc} = require("../../../common/util/commonUtil")
const {getAvatarSource} = require("../../util")
import { Avatar ,SearchBar} from 'react-native-elements'

import {
    Body, Button, Card, CardItem, Container, Content ,Header,Icon,Input,Item,Left,
    List,ListItem,Right,Spinner,Thumbnail,Toast
} from 'native-base';

export default class ContactView extends Component<{}> {
    static navigationOptions =({ navigation, screenProps }) => (
        {
            headerRight: (
                <TouchableOpacity onPress={debounceFunc(()=>{ navigation.navigate("AddContactView")})}
                                  style={{marginRight:20}}>
                    <Icon name="plus" size={22} />
                </TouchableOpacity>
            )
        }
    );

    constructor(props){
        super(props);
        this.props.navigation.setParams({
            ContactView:this
        });
        this.eventAry = []

    }

    componentDidMount(){
        for(let event of this.eventAry){
            // Store.on(event,this.update);
        }
    }

    componentWillUnmount =()=> {
        for(let event of this.eventAry){
            // Store.un(event,this.update);
        }
    }

    update = ()=>{
        this.setState({update:true});
    }

    go2RequireListView=debounceFunc(()=>{
        this.props.navigation.navigate("RequireListView",{ContactView:this});
    })

    go2FriendInfoView=debounceFunc((f)=>{
        this.props.navigation.navigate("FriendInfoView",{ContactView:this,friend:f});
    })

    doSearch(){

    }

    textChange(){

    }
    someMethod(){

    }

    render() {
        const searchBarBgColor = Platform.OS === 'android' ?'#bdc6cf' :'#f0f0f0'
        return (
           <View>

               <SearchBar
                   lightTheme
                   clearIcon={{ color: 'red' }}
                   onChangeText={this.someMethod}
                   onClear={this.someMethod}
                   placeholder='Type Here...'
                   inputContainerStyle={{backgroundColor:"blue"}}
                   containerStyle={{}}
               />

           </View>

        );
    }

}
