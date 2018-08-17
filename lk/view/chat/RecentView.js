
import React, { Component } from 'react';
import {
    Alert,Image,
    ScrollView,
    TouchableOpacity,
    View,
} from 'react-native';
import { Badge,  Button, Icon as NBIcon,Text,SwipeRow
} from 'native-base';
const {GroupAvatar,commonUtil} = require("@hfs/common")
const {getAvatarSource,debounceFunc} = commonUtil
const {alert} = Alert
const LKChatProvider = require("../../logic/provider/LKChatProvider")
const LKContactProvider = require("../../logic/provider/LKContactProvider")
const lkApp = require('../../LKApplication').getCurrentApp()
const manifest = require('../../../Manifest')
const chatManager = manifest.get("ChatManager")

export default class RecentView extends Component<{}> {

    static navigationOptions =( ) => {
        return {
            headerTitle:"消息"
        }
    }

    constructor(props){
        super(props);

        this.state = {
            contentAry : null,
        }
        this.eventAry = ["msgChanged"]
    }

    update=()=>{
        this.updateRecent()
    }

    componentWillMount =()=> {
        for(let event of this.eventAry){
            chatManager.on(event,this.update);
        }
    }

    componentWillUnmount =()=> {
        for(let event of this.eventAry){
            chatManager.un(event,this.update);
        }
    }
    componentDidMount=()=>{
        this.updateRecent()
    }

    async updateRecent(){
        const user = lkApp.getCurrentUser()
        const allChat = await LKChatProvider.asyGetAll(user.id)
        const recentAry = []
        for(let chat of allChat){
            const obj = {}
            const {newMsgNum} = chat
            const msgAry = await LKChatProvider.asyGetMsgs(user.id,chat.id,1)
            const {length} = msgAry

            if(length){
                const msg = msgAry[0]
                const {sendTime,content,id} = msg

                const person = await LKContactProvider.asyGet(chat.id)
                const {name,pic} = person
                obj.time = this.getDisplayTime(new Date(sendTime))
                obj.content = content
                obj.sendTime = sendTime
                obj.newMsgNum = newMsgNum
                obj.name = name
                obj.person = person
                obj.pic = pic
                obj.id = id
                recentAry.push(obj)
            }
        }
        // console.log(recentAry)

        recentAry.sort((obj1,obj2)=>{
            return obj1.sendTime - obj2.sendTime
        })

        let contentAry = []
        const avatarLength = 50
        for(let recent of recentAry){
            let content = (
                <TouchableOpacity onPress={()=>{
                    this.chat(recent.person)
                }}
                                  style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",height:55,
                                      alignItems:"center"}}>
                    <Image resizeMode="cover" style={{width:avatarLength,height:avatarLength,margin:5,borderRadius:5}} source={getAvatarSource(recent.pic,require("../image/defaultAvatar.png"))} />
                    <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginHorizontal:10}}>
                        <View style={{flexDirection:"column",justifyContent:"space-around",alignItems:"flex-start",height:"100%"}}>
                            <View >
                                <Text style={{fontSize:18,fontWeight:"500"}}>
                                    {recent.name}
                                </Text>
                            </View>
                            <View>
                                <Text style={{fontSize:15,fontWeight:"400",color:"#a0a0a0",marginTop:3}}>
                                    {recent.content}
                                </Text>
                            </View>
                        </View>
                        <View style={{display:"flex",flexDirection:"column",justifyContent:"space-around",alignItems:"center",height:"100%"}}>
                            <Text style={{fontSize:15,fontWeight:"400",color:"#a0a0a0",marginBottom:3}}>
                                {recent.time}
                            </Text>
                            <View>
                                {recent.newMsgNum?
                                    <Badge style={{transform: [{scaleX:0.8},{scaleY:0.8}]}}>
                                        <Text style={{}}>{recent.newMsgNum}</Text>
                                    </Badge>
                                    :null}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )

            let ele = (
                <SwipeRow
                    rightOpenValue={-75}

                    body={
                        content
                    }
                    right={
                        <Button danger onPress={() => {
                            this.deleteRow(recent)
                        }}>
                            <NBIcon active name="trash" />
                        </Button>
                    }
                    key = {recent.id}
                />
            )
            contentAry.push( ele)
        }
        // console.log(contentAry)

        this.setState({
            contentAry
        })


    }

    getDisplayTime(date){
        let result = ''
        const now = new Date()
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const dayDiff = Math.floor(now.getTime() / (1000*60*60*24)) - Math.floor(date.getTime() / (1000*60*60*24))

        if(year === now.getFullYear()){
            if(month === now.getMonth() && day === now.getDate()){
                let prefix = ''
                if(hour < 12){
                    prefix = '上午'
                }else if(hour > 12){
                    prefix = '下午'
                }else if(hour === 12){
                    prefix = '中午'
                }
                result = `${prefix} ${hour}:${this.pad(minute)}`
            }else{
                result = `${this.pad(month+1)}-${day}`
            }
        }else{
            result = `${year}-${this.pad(month+1)}月-${day}日`
        }
        if(dayDiff === 1){
            result = '昨天'
        }
        return result
    }

    pad(num){
        num = String(num)
        if(num.length === 1){
            num = '0'+num
        }
        return num
    }

    chat = debounceFunc((person)=>{
        this.props.navigation.navigate("ChatView",{friend:person});
    })

    groupChat = debounceFunc( (group)=>{
        this.props.navigation.navigate("ChatView",{group});
    })
    test(){
        alert('test')
    }

    deleteRow(data) {
        // Store.deleteRecent(data.id,()=>{
        //     this.update()
        // })
    }

    render() {
        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>
                {/*<TouchableOpacity onPress={()=>{this.props.navigation.navigate('ContactTab')}} style={{marginTop:30,width:"90%",height:50,borderColor:"gray",borderWidth:1,borderRadius:5,flex:0,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>*/}
                    {/*<Text style={{fontSize:18,textAlign:"center",color:"gray"}}>开始和好友聊天吧!</Text>*/}
                {/*</TouchableOpacity>*/}
                 <ScrollView ref="scrollView" style={{width:"100%",paddingTop:10}} keyboardShouldPersistTaps="always">
                    {this.state.contentAry}
                </ScrollView>
            </View>
        );
    }

}
