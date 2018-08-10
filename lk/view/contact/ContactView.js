import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
} from 'react-native';
const common = require('@hfs/common')
const {SearchBar,commonUtil,List} = common
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

    go2FriendInfoView=debounceFunc((f)=>{
        this.props.navigation.navigate("FriendInfoView",{friend:f});
    })

    go2OrgView = debounceFunc((org)=>{
        this.props.navigation.navigate("LoadingView",{org});
    })


    async asyncRender(filterText){
        const user = lkApp.getCurrentUser();
        let  orgAry = await LKOrgProvider.asyGetChildren(null,user.id)
        const sortFunc = (ele1,ele2)=>{
            const result = (ele2.title < ele1.title)

            return result
        }
        let dataAry = []

        const _f = (item,content,ary)=>{
            if(filterText){
                if(item.name.includes(filterText)){
                    ary.push(content)
                }
            }else{
                ary.push(content)
            }
        }
        let ary = []
        for(let ele of orgAry){
            const obj = {}
            obj.onPress = ()=>{
                this.go2OrgView(ele)
            }
            obj.title = ele.name
            obj.image = require('../image/folder.png')
            obj.key = ele.id
            _f(ele,obj,ary)
        }
        ary.sort(sortFunc)
        dataAry = dataAry.concat(ary)
        ary = []
        const memberAry = await LKContactProvider.asyGetAllMembers(user.id)

        for(let ele of memberAry){
            const obj = {}
            obj.onPress = ()=>{
                this.go2FriendInfoView(ele)
            }
            obj.title = ele.name
            obj.image = getAvatarSource(ele.pic)
            obj.key = ele.id
            _f(ele,obj,ary)
        }

        ary.sort(sortFunc)
        dataAry = dataAry.concat(ary)

        this.setState({
            contentAry:(
                <List data={dataAry}></List>
            )
        })
    }

    onChangeText = (t)=>{
        t = t.trim()
        this.asyncRender(t)
    }

    render() {
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
               <List data={[{
                   onPress:()=>{
                       this.props.navigation.navigate("ExternalView")
                   },
                   title:"外部联系人",
                   image:require('../image/contact.png'),
                   key:'ExternalView'
               }]}></List>

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
