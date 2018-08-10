import React, { Component } from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
const common = require('@hfs/common')
const {SearchBar,commonUtil} = common
const {debounceFunc} = commonUtil
const lkApp = require('../../LKApplication').getCurrentApp()
const LKContactProvider =  require("../../logic/provider/LKContactProvider")
const LKOrgProvider =  require("../../logic/provider/LKOrgProvider")
const {getAvatarSource} = require("../../util")
const style = require('../style')



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
            contentAry:[]
        }

    }

    componentDidMount(){
        // for(let event of this.eventAry){
        //     // Store.on(event,this.update);
        // }
        this.asyncRender()
    }

    componentWillUnmount =()=> {
        // for(let event of this.eventAry){
        //     // Store.un(event,this.update);
        // }
    }

    update = ()=>{

        this.setState({update:true})
    }

    go2RequireListView=debounceFunc(()=>{
        this.props.navigation.navigate("RequireListView",{ContactView:this});
    })

    go2FriendInfoView=debounceFunc((f)=>{
        this.props.navigation.navigate("FriendInfoView",{friend:f});
    })

    go2OrgView = debounceFunc((org)=>{
        this.props.navigation.navigate("OrgView",{org});
    })

    someMethod(content){
       this.content = content
    }

    async asyncRender(filterText){
        const contentAry = []

        const _f = (item,content)=>{
            if(filterText){
                if(item.name.includes(filterText)){
                    contentAry.push(content)
                }
            }else{
                contentAry.push(content)
            }
        }

        const user = lkApp.getCurrentUser();
        const orgAry = await LKOrgProvider.asyGetChildren(null,user.id)
        for(let i=0;i<orgAry.length;i++){
            let org = orgAry[i];
            const content = (
                <View style={{backgroundColor:"white",borderBottomColor:"#f0f0f0",borderBottomWidth:1}} key={i+"org"}>
                    <TouchableOpacity  onPress={()=>{
                        this.go2OrgView(org)
                    }} style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",height:55,
                        alignItems:"center",}} >
                        <Image resizeMode="cover" style={{width:45,height:45,margin:5,borderRadius:5}} source={require('../image/folder.png')} />
                        <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginHorizontal:10}}>
                            <Text style={{fontSize:18,fontWeight:"500"}}>
                                {org.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )

            _f(org,content)

        }
        const all = await LKContactProvider.asyGetAllMembers(user.id)
        for(let i=0;i<all.length;i++){
            let f = all[i];
            const content = (
                <View style={{backgroundColor:"white",borderBottomColor:"#f0f0f0",borderBottomWidth:1}} key={i+'friend'}>
                    <TouchableOpacity  onPress={()=>{
                        this.go2FriendInfoView(f)
                    }} style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",height:55,
                        alignItems:"center",}} >
                        <Image resizeMode="cover" style={{width:45,height:45,margin:5,borderRadius:5}} source={getAvatarSource(f.pic)} />
                        <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginHorizontal:10}}>
                            <Text style={{fontSize:18,fontWeight:"500"}}>
                                {f.name}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
            _f(f,content)
        }

        this.setState({
            contentAry
        })
    }


    onChangeText = (t)=>{
        t = t.trim()
        this.asyncRender(t)
    }

    render() {
        console.log('render')

        return (
           <ScrollView>
               <SearchBar
                   onChangeText={this.onChangeText}
                   clearIconStyle={{color:style.color.mainColor}}
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
                       this.props.navigation.navigate("ExternalView")
                   }} style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",height:55,
                                          alignItems:"center"}}>
                       <Image resizeMode="cover" style={{width:45,height:45,margin:5,borderRadius:5}} source={require('../image/contact.png')} />
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
               {this.state.contentAry}
           </ScrollView>

        );
    }

}
