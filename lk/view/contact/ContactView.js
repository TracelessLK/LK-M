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
const lkApp = require('../../LKApplication').getCurrentApp()
const manifest = require('../../../Manifest')

import {
    Body, Button, Card, CardItem, Container, Content ,Header,Icon,Input,Item,Left,
    List,ListItem,Right,Spinner,Thumbnail,Toast
} from 'native-base';
const util = require('../util/navigatorUtil')

export default class ContactView extends Component<{}> {
    static navigationOptions =({ navigation, screenProps }) => {
        return {
            tabBarIcon: ({ tintColor, focused }) =>{
                return util.getTabLogo('通讯录',focused,"table-of-contents" ,20)
            }
        }
    }


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
        const user = lkApp.getCurrentUser();
        (async()=>{
            const LKContactProvider =   manifest.get('LKContactProvider')
            const allContact = await LKContactProvider.asyGetAll(user.id)
            console.log(allContact)
            console.log('sdfs')


        })()

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
                   placeholder='搜索'
                   containerStyle={{backgroundColor:"#f0f0f0"}}
                   inputStyle={ {
                       backgroundColor:"white",display:'flex',
                       alignItems:"center",justifyContent:"center",color:"black"
                   }}
               />
               <View>
                   <View style={{padding:10}}>
                       <Text style={{color:"#a0a0a0"}}>
                           外部联系人
                       </Text>
                   </View>
                   <View  style={{width:"100%",height:0,borderTopWidth:1,borderColor:"#f0f0f0"}}>
                   </View>
               </View>
               <View style={{backgroundColor:"white"}}>
                   <TouchableOpacity  onPress={()=>{

                   }} style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",height:55,
                                          alignItems:"center"}}>
                       <Image resizeMode="cover" style={{width:45,height:45,margin:5,borderRadius:5}} source={require('../../image/contact.png')} />
                       <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginHorizontal:10}}>
                           <Text style={{fontSize:18,fontWeight:"500"}}>
                               外部联系人
                           </Text>
                       </View>
                   </TouchableOpacity>
               </View>
               <View>
                   <View style={{padding:10}}>
                       <Text style={{color:"#a0a0a0"}}>
                           组织通讯录
                       </Text>
                   </View>
                   <View  style={{width:"100%",height:0,borderTopWidth:1,borderColor:"#f0f0f0"}}>
                   </View>
               </View>
           </View>

        );
    }

}
