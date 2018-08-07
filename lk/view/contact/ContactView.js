import React, { Component } from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Avatar ,SearchBar} from 'react-native-elements'
const {debounceFunc} = require("../../../common/util/commonUtil")
const lkApp = require('../../LKApplication').getCurrentApp()
const LKContactProvider =  require("../../logic/provider/LKContactProvider")
const LKOrgProvider =  require("../../logic/provider/LKOrgProvider")
const {getAvatarSource} = require("../../util")



export default class ContactView extends Component<{}> {
    static navigationOptions =() => {
        return {
            headerTitle:"通讯录"
        }
    }


    constructor(props){
        super(props);
        this.props.navigation.setParams({
            ContactView:this
        });
        this.eventAry = []
        this.state = {
            friendAry:[]
        }

    }

    componentDidMount(){
        // for(let event of this.eventAry){
        //     // Store.on(event,this.update);
        // }
        (async()=>{


            // const topOrg = await LKOrgProvider.asyGetChildren(null,user.id)
            // console.log(topOrg)


        })()
        this.asyncRender()

    }

    componentWillUnmount =()=> {
        // for(let event of this.eventAry){
        //     // Store.un(event,this.update);
        // }
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

    someMethod(){
//
    }

    async asyncRender(){
        const user = lkApp.getCurrentUser();
        console.log(user)
        let friends = [];
        const all = await LKContactProvider.asyGetAll(user.id)
        console.log(all)
        for(let i=0;i<all.length;i++){
            let f = all[i];

            friends.push(<TouchableOpacity key={i} onPress={()=>{this.go2FriendInfoView(f)}} style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Avatar
                        source={getAvatarSource(f.pic)}
                        onPress={() => {}}
                        activeOpacity={1}
                    />
                    <Text>    {f.name}  </Text>
                </View>
            </TouchableOpacity>);
            friends.push(<View key={i+"line"} style={{width:"100%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>);

        }
        console.log(friends)

        this.setState({
            friendAry:friends
        })
    }

    render() {

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
               {this.state.friendAry}
           </View>

        );
    }

}
