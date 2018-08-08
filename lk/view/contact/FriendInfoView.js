
import React, { Component } from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
const {getAvatarSource} = require("../../util")


export default class FriendInfoView extends Component<{}> {
    static navigationOptions =({ navigation }) => {
        const {friend} = navigation.state.params
        return {
            headerTitle:friend.name
        }
    }
    constructor(props) {
        super(props);
        this.state = {};
        this.friend = this.props.navigation.state.params.friend;
    }

    sendMessage=()=>{

        this.props.navigation.navigate("ChatTab");
        this.props.navigation.navigate("ChatView",{friend:this.friend});
    }

    render() {
        let friend = this.friend;
        return (

            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor:"#ffffff",paddingTop:20}}>
                <Image source={getAvatarSource(this.friend.pic)}
                       style={{margin:10,width:100,height:100,borderRadius:5}} resizeMode="contain"></Image>


                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Text>标识：</Text><Text>{friend.id}</Text>
                </View>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40,marginTop:20}}>
                    <Text>昵称：</Text><Text>{friend.name}</Text>
                </View>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#d0d0d0"}}></View>
                <TouchableOpacity onPress={this.sendMessage} style={{marginTop:30,width:"90%",height:40,borderColor:"gray",borderWidth:1,borderRadius:5,flex:0,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                    <Text style={{fontSize:18,textAlign:"center",color:"gray"}}>发消息</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
