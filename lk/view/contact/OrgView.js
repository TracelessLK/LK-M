
import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import { SearchBar} from 'react-native-elements'
const lkApp = require('../../LKApplication').getCurrentApp()
const LKContactProvider =  require("../../logic/provider/LKContactProvider")
const LKOrgProvider =  require("../../logic/provider/LKOrgProvider")
const {debounceFunc} = require("../../../common/util/commonUtil")
const {getAvatarSource} = require("../../util")


export default class OrgView extends Component<{}> {
    static navigationOptions =({ navigation }) => {
        const {org} = navigation.state.params
        return {
            headerTitle:org.name
        }
    }
    constructor(props){
        super(props);
        this.state = {
            contentAry:[]
        }
        this.org = this.props.navigation.state.params.org
    }

    componentDidMount(){
        // for(let event of this.eventAry){
        //     // Store.on(event,this.update);
        // }
        this.asyncRender()

    }


    componentDidUpdate(){
    }


    componentWillUnmount(){

    }

    go2OrgView = debounceFunc((org)=>{
        this.props.navigation.navigate({routeName:"OrgView", params:{org}, key:org.id});
    })

    async asyncRender(){
        const user = lkApp.getCurrentUser();
        const orgAry = await LKOrgProvider.asyGetChildren(this.org.id,user.id)
        const contentAry = []
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

            contentAry.push(content)
        }
        let all = await LKContactProvider.asyGetAll(user.id)
        all = all.filter(ele=>{
            return ele.orgId === this.org.id
        })
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

            contentAry.push(content)
        }

        this.setState({
            contentAry
        })
    }

    render() {
        return (
            <ScrollView>

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
                            组织通讯录
                        </Text>
                    </View>
                    <View  style={{width:"100%",height:0,borderTopWidth:1,borderColor:"#f0f0f0"}}>
                    </View>
                </View>
                {this.state.contentAry}
            </ScrollView>
        )
    }

}

OrgView.defaultProps = {

}

OrgView.propTypes = {

}
