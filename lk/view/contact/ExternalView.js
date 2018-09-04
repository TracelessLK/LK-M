
import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    Image
} from 'react-native';
const common = require('@external/common')
const {SearchBar,commonUtil,List,LoadingView} = common
const {debounceFunc} = commonUtil
const lkApp = require('../../LKApplication').getCurrentApp()
const style = require('../style')
const LKContactProvider =  require("../../logic/provider/LKContactProvider")
const {getAvatarSource} = require("../../util")

export default class ExternalView extends Component<{}> {

    static navigationOptions =() => {
        return {
            headerTitle:"外部联系人"
        }
    }
    constructor(props){
        super(props);
        this.state = {
            content:null,
            loading:true
        }
    }

    componentDidMount(){
        // for(let event of this.eventAry){
        //     // Store.on(event,this.update);
        // }
        this.asyncRender()
    }

    go2FriendInfoView=debounceFunc((f)=>{
        this.props.navigation.navigate("FriendInfoView",{friend:f});
    })

    async asyncRender(filterText){
        const user = lkApp.getCurrentUser();
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

        const friendAry = await LKContactProvider.asyGetAllFriends(user.id)

        for(let ele of friendAry){
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

        const size = 120
        const noUser = (
            <View style={{display:'flex',flex:1,alignItems:'center',justifyContent:'flex-start',marginTop:200}}>
                <Image source ={require('../image/noUser.png')} style={{width:size,height:size}} resizeMode='contain'/>
                <View style={{margin:20}}>
                    <Text style={{color:style.color.secondColor,fontSize:18}}>
                        没有外部联系人
                    </Text>
                </View>

            </View>
        )
        const content = dataAry.length?(
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
                    <List data={dataAry}></List>
                </View>
            </ScrollView>
        ):noUser

        this.setState({
            content,
            loading:false
        })
    }


    onChangeText = (t)=>{
        t = t.trim()
        this.asyncRender(t)
    }

    render() {
        return <LoadingView loading={this.state.loading} content={this.state.content}></LoadingView>
    }

}

ExternalView.defaultProps = {

}

ExternalView.propTypes = {

}
