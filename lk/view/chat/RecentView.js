
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
const LKChatProvider = require("../")

export default class RecentView extends Component<{}> {

    static navigationOptions =( ) => {
        return {
            headerTitle:"消息"
        }
    }

    constructor(props){
        super(props);

        this.state = {
            listViewData : null,
        }
        this.eventAry = ["sendMessage","receiveMessage","readChatRecords","readGroupChatRecords",
            "addGroup","receiveGroupMessage","updateFriendPic","updateFriendName"]
    }

    update=(fromId)=>{
        this.updateRecent()
    }

    componentWillMount =()=> {
        for(let event of this.eventAry){
            // Store.on(event,this.update);
        }
    }

    componentWillUnmount =()=> {
        for(let event of this.eventAry){
            // Store.un(event,this.update);
        }
    }
    componentDidMount=()=>{
        this.updateRecent()
        console.log()

    }

    componentWillUpdate(){

    }

    updateRecent(){
        // let recent = Store.getAllRecent();
        //
        // recent = _.cloneDeep(recent)
        //
        // let promiseAry = []
        // for(let ele of recent){
        //     promiseAry.push(this.getLastMsg(ele.id))
        // }
        // Promise.all(promiseAry).then(resultMsgAry=>{
        //
        //     for(let i =0;i<recent.length;i++){
        //         if(resultMsgAry[i]){
        //             recent[i].lastMsg = resultMsgAry[i].content
        //             recent[i].time = this.getDisplayTime(new Date(resultMsgAry[i].time))
        //         }
        //     }
        //     this.setState({
        //         listViewData:recent,
        //     })
        // })
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

    chat = debounceFunc((uid)=>{
        const f = Store.getFriend(uid);

        this.props.navigation.navigate("ChatView",{friend:f});
    })

    groupChat = debounceFunc( (group)=>{
        this.props.navigation.navigate("ChatView",{group});
    })
    test(){
        alert('test')
    }

    deleteRow(data) {
        Store.deleteRecent(data.id,()=>{
            this.update()
        })
    }

    getLastMsg(chatId){
        return new Promise(resolve=>{
            // Store.readAllChatRecords(chatId,false,(res)=>{
            //     console.log(res)
            //
            // })
            Store._getLocalRecords(chatId,(res)=>{
                // console.log(res)

                let result = null
                const {length} = res
                if(length > 0){
                    result = res[res.length-1]

                    const {type} = result
                    const {length} = result.content
                    const maxDisplay = 15
                    if(type === Store.MESSAGE_TYEP_TEXT){
                        if(length > maxDisplay){
                            result.content = result.content.substring(0,maxDisplay)+"......"
                        }
                    }else if(type === Store.MESSAGE_TYPE_IMAGE){
                        result.content = '[图片]'
                    }else if(type === Store.MESSAGE_TYPE_FILE){
                        result.content = '[文件]'
                    }
                }
                resolve(result)
            })
        })

    }

    render() {
        // // console.log( this.state.listViewData)
        //
        //
        // // let groups = Store.getGroups();
        // let groupAry=[];
        // // if(groups){
        // //     for(let i=0;i<groups.length;i++){
        // //         let group = groups[i];
        // //         let redTip=null;
        // //         if(group.newReceive){
        // //             redTip =  <Badge style={{transform: [{scaleX:0.8},{scaleY:0.8}]}}>
        // //                 <Text style={{}}>{group.newMsgNum}</Text>
        // //             </Badge>
        // //         }
        // //         groupAry.push(<TouchableOpacity key={i}    onPress={()=>{this.groupChat(group)}} style={{width:"100%",flexDirection:"row",justifyContent:"center"}}>
        // //             <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:"100%",height:50,marginTop:20}}>
        // //                 <View style={{flexDirection:"row",justifyContent:"center",alignItems:"flex-start",margin:5,borderRadius:5}}>
        // //                     <GroupAvatar group={group} ></GroupAvatar>
        // //                     <Text>    {group.name}  </Text>
        // //                 </View>
        // //                 <View style={{paddingRight:58,flexDirection:"column",justifyContent:"flex-start",alignItems:"flex-start"}}>
        // //                     {redTip}
        // //                 </View>
        // //
        // //             </View>
        // //         </TouchableOpacity>);
        // //         groupAry.push(<View key={i+"line"} style={{width:"100%",height:0,borderTopWidth:1,borderColor:"#f0f0f0"}}>
        // //
        // //         </View>);
        // //
        // //     }
        // // }
        //
        // let contentAry = []
        // const avatarLength = 50
        // if(this.state.listViewData){
        //     for(let data of this.state.listViewData){
        //         let content = (
        //             <TouchableOpacity onPress={()=>{
        //
        //                 this.chat(data.id)
        //             }}
        //                               style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",height:55,
        //                                   alignItems:"center"}}>
        //                 <Image resizeMode="cover" style={{width:avatarLength,height:avatarLength,margin:5,borderRadius:5}} source={getAvatarSource(Store.getFriend(data.id).pic)} />
        //                 <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginHorizontal:10}}>
        //                     <View style={{flexDirection:"column",justifyContent:"space-around",alignItems:"flex-start",height:"100%"}}>
        //                         <View >
        //                             <Text style={{fontSize:18,fontWeight:"500"}}>
        //                                 {Store.getFriend(data.id).name}
        //                             </Text>
        //                         </View>
        //                         <View>
        //                             <Text style={{fontSize:15,fontWeight:"400",color:"#a0a0a0",marginTop:3}}>
        //                                 {data.lastMsg}
        //                             </Text>
        //                         </View>
        //                     </View>
        //                     <View style={{display:"flex",flexDirection:"column",justifyContent:"space-around",alignItems:"center",height:"100%"}}>
        //                         <Text style={{fontSize:15,fontWeight:"400",color:"#a0a0a0",marginBottom:3}}>
        //                             {data.time}
        //                         </Text>
        //                         <View>
        //                             {data.newReceive?
        //                                 <Badge style={{transform: [{scaleX:0.8},{scaleY:0.8}]}}>
        //                                     <Text style={{}}>{data.newMsgNum}</Text>
        //                                 </Badge>
        //                                 :null}
        //                         </View>
        //                     </View>
        //                 </View>
        //             </TouchableOpacity>
        //         )
        //
        //         let ele = (
        //             <SwipeRow
        //                 rightOpenValue={-75}
        //
        //                 body={
        //                     content
        //                 }
        //                 right={
        //                     <Button danger onPress={() => {
        //                         this.deleteRow(data)
        //                     }}>
        //                         <NBIcon active name="trash" />
        //                     </Button>
        //                 }
        //                 key = {data.id}
        //             />
        //         )
        //         contentAry.push( ele)
        //     }
        // }

        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff"}}>

                {/*{this.state.listViewData?*/}
                    {/*(!this.state.listViewData.length && !groupAry.length?*/}
                        {/*<TouchableOpacity onPress={()=>{this.props.navigation.navigate('ContactTab')}} style={{marginTop:30,width:"90%",height:50,borderColor:"gray",borderWidth:1,borderRadius:5,flex:0,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>*/}
                            {/*<Text style={{fontSize:18,textAlign:"center",color:"gray"}}>开始和好友聊天吧!</Text>*/}
                        {/*</TouchableOpacity>*/}
                        {/*: <ScrollView ref="scrollView" style={{width:"100%",paddingTop:10}} keyboardShouldPersistTaps="always">*/}
                            {/*{contentAry}*/}
                            {/*{groupAry.length === 0?null:*/}
                                {/*<View>*/}
                                    {/*<View style={{padding:10}}>*/}
                                        {/*<Text style={{color:"#a0a0a0"}}>*/}
                                            {/*群消息*/}
                                        {/*</Text>*/}

                                    {/*</View>*/}
                                    {/*<View  style={{width:"100%",height:0,borderTopWidth:1,borderColor:"#f0f0f0"}}>*/}

                                    {/*</View>*/}
                                {/*</View>*/}
                            {/*}*/}

                            {/*{groupAry}*/}
                        {/*</ScrollView>)*/}
                    {/*:null*/}
                {/*}*/}

            </View>
        );
    }

}
