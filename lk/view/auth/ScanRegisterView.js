
import React from 'react';
import { Image, Keyboard, Modal,StyleSheet,Text,TextInput,Alert,
    TouchableOpacity,TouchableWithoutFeedback,View} from 'react-native';
import {Toast} from 'native-base'
import AppUtil from "../../AppUtil";
import UUID from 'uuid/v4';
import RSAKey from 'react-native-rsa';
import ScanView from '../../../common/view/ScanView'
import Icon from 'react-native-vector-icons/FontAwesome'
import pushUtil from "../../../common/util/pushUtil";
const versionLocal = require('../../../package').version
const util = require('../../util')
const config = require('../../config')
import CheckCodeView from './CheckCodeView'
const lkApplication = require('../../LKApplication')
const lkStyle = require('../style')

export default class ScanRegisterView extends React.Component {
    static navigationOptions =({ navigation, screenProps }) => {
        return {
            header:null
        }
    }
    constructor(props) {
        super(props);

        this.state={
            checkCodeMode:false
        };


    }

    componentDidMount () {
    }

    componentWillUnmount () {
    }

    showScanView=()=>{
        this.props.navigation.navigate("ScanView",{onRead:(e)=>{
            console.log(e)
            
            }})
        // this.setState({scanVisible:true});
    }



    dismissKeyboard=()=>{
        Keyboard.dismiss();
    }

    onRead = (e)=>{
        const {data} = e

        const decryptedText = util.decryptAes(data)
        const obj = JSON.parse(decryptedText)

        if(obj.action === 'registerForAdmin') {
            this.setState({
                scanVisible: false,
            })
            this.props.navigation.navigate("CheckCodeView", {
                obj
            })
        }else if(obj.action === 'register'){
            this.setState({
                scanVisible: false,
            })
            this.props.navigation.navigate("RegisterView", {
                obj,
                qrcode:data
            })


        }else{
            Toast.show({
                text: '该二维码无效',
                position: "top",
                type:"warning",
                duration: 5000
            })
        }


    }

    render() {
        const logoView = <Image source={require('../../image/1024x1024.png')} style={{width:150,height:150,marginBottom:50,marginTop:100}} resizeMode="cover"></Image>
        let content = (
            <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
                <View style={{display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"center",flex:1,backgroundColor:"#ffffff"}}>

                    {logoView}
                    <View style={{height:40,backgroundColor:"#f0f0f0",width:"100%",flexDirection:"row",alignItems:"center"}}>
                        <View style={{width:4,height:18,backgroundColor:lkStyle.color.mainColor,marginLeft:10}}></View>
                        <Text style={{color:"#a0a0a0",paddingLeft:5,fontSize:14}}>{this.state.step==1?"注册":this.isFreeRegister?"来个炫酷的昵称":"请输入口令"}</Text>
                    </View>
                    <View style={{height:120,backgroundColor:"#ffffff",width:"100%",flexDirection:"column",justifyContent:"flex-start",alignItems:"center"}}>
                        <TouchableOpacity style={{height:50,backgroundColor:"#ffffff",width:"100%",flexDirection:"row",
                            borderBottomWidth:1,borderColor:lkStyle.color.secondColor,justifyContent:'flex-start',alignItems:"center"}}
                                          onPress={this.showScanView}>
                            <Icon name="qrcode" size={30}  color={lkStyle.color.mainColor} style={{margin:10}}/>
                            <Text style={{}}>扫码注册</Text>

                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,width:"100%",backgroundColor:"#ffffff"}}>
                    </View>
                    <View style={{height:60,width:"100%",backgroundColor:"#f0f0f0",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                        <Text style={{color:"#a0a0a0",textAlign:"center",fontSize:10}}>版本：v{versionLocal}</Text>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        )
        if(this.state.checkCodeMode){
            content = (
                <CheckCodeView decryptedText={this.decryptedText}></CheckCodeView>
            )
        }
        return content;

    }
}
