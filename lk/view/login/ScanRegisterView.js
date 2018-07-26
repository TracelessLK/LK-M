
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

export default class ScanRegisterView extends React.Component {

    constructor(props) {
        super(props);

        this.state={
            scanVisible:false,
            step:1,
            isShowingLogo:true,
            checkCodeMode:false
        };


    }

    componentDidMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=>{
            this.setState({
                isShowingLogo:false
            })
        });
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ()=>{
            this.setState({
                isShowingLogo:true
            })
        });
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }

    showScanView=()=>{

        this.setState({scanVisible:true});
    }



    nameTextChange=(v)=>{
        this.name = v;
    }

    checkCodeTextChange=(v)=>{
        this.checkCode = v;
    }



    createKey=()=>{
        if(!this.publicKey&&!this.privateKey){
            const bits = 1024;
            const exponent = '10001';
            let rsa = new RSAKey();
            rsa.generate(bits, exponent);
            this.publicKey = rsa.getPublicString(); // return json encoded string
            this.privateKey = rsa.getPrivateString(); // return js
        }
    }

    _doRegister = ()=>{
        this.createKey();
        this.setState({registerStep:"获取设备标识......"});

        let uid=this.uid||UUID();
        let cid=UUID();
        let curView = this;
        pushUtil.getAPNDeviceId().then(deviceId=>{
            curView.setState({registerStep:"注册中......"});
            WSChannel.register(this.ip,uid,cid,deviceId,this.name,this.publicKey,this.checkCode,(data)=>{
                this.setState({registering:false});
                if(data.err){
                    curView.setState({registerStep:"注册出错......"});
                    alert(data.err);
                }else{
                    AppUtil.reset();
                }
            },()=>{
                curView.setState({registerStep:"网络访问超时......"});
            });
        })

    }

    register=()=>{
        if(this.isFreeRegister&&!this.name){
            alert("请输入昵称");
            return;
        }
        if(!this.isFreeRegister&&this.needCheckCode&&!this.checkCode){
            alert("请输入口令");
            return;
        }
        this.setState({registering:true,registerStep:"创建密钥中......"});

        setTimeout( ()=> {
            this._doRegister();
        },10);

    }

    dismissKeyboard=()=>{
        Keyboard.dismiss();
    }

    onRead = (e)=>{
        const {data} = e

        const decryptedText = util.decryptAes(data)
        const obj = JSON.parse(decryptedText)
        if(obj.action === 'registerForAdmin'){
            this.setState({
                scanVisible:false,
            })
            this.props.navigation.navigate("CheckCodeView",{
                obj
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
        const logoView = <Image source={require('../../image/1024x1024.png')} style={{width:100,height:100,margin:50}} resizeMode="contain"></Image>
        let content = (
            <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
                <View style={{display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"center",flex:1,backgroundColor:"#ffffff"}}>
                    <View style={{width:"100%",height:50,backgroundColor:"#ffffff",flexDirection:"column",justifyContent:"center",marginTop:10}}>
                        {
                            this.state.step==1?null:<TouchableOpacity style={{}} onPress={this.cancel}>
                                <Text style={{fontSize:16,paddingLeft:10}}>取消</Text>
                            </TouchableOpacity>
                        }

                    </View>
                    {/*<View style={{width:100,height:100,borderWidth:1,borderStyle:"solid",borderColor:"#f0f0f0",marginTop:30,marginBottom:30,overflow:"hidden"}}>*/}
                    {/*<Icon name="user" size={70}  color="#d0d0d0" style={{textAlign:"center",lineHeight:90}}/>*/}
                    {/*</View>*/}

                    {this.state.isShowingLogo?logoView:null}
                    <View style={{height:40,backgroundColor:"#f0f0f0",width:"100%",flexDirection:"row",alignItems:"center"}}>
                        <View style={{width:4,height:18,backgroundColor:"#f9e160",marginLeft:10}}></View>
                        <Text style={{color:"#a0a0a0",paddingLeft:2,fontSize:12}}>{this.state.step==1?"注册":this.isFreeRegister?"来个炫酷的昵称":"请输入口令"}</Text>
                    </View>
                    {
                        this.state.step==1?
                            <View style={{height:120,backgroundColor:"#ffffff",width:"100%",flexDirection:"column",justifyContent:"flex-start",alignItems:"center"}}>
                                <TouchableOpacity style={{height:50,backgroundColor:"#ffffff",width:"100%",flexDirection:"row",
                                    borderBottomWidth:1,borderColor:"#f9e160",justifyContent:'flex-start',alignItems:"center"}}
                                                  onPress={this.showScanView}>
                                    <Icon name="qrcode" size={30}  color="#f9e160" style={{margin:10}}/>
                                    <Text style={{}}>扫码注册</Text>

                                </TouchableOpacity>
                                {this.state.registering ?
                                    <View style={{
                                        width: "90%",
                                        height: 40,
                                        marginTop: 24,
                                        borderColor: "#535353",
                                        backgroundColor: "#636363",
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        flex: 0,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{
                                            fontSize: 18,
                                            textAlign: "center",
                                            color: "white"
                                        }}>{this.state.registerStep}</Text>
                                        <Image source={require('../../image/loading.gif')}
                                               style={{width: 18, height: 18, marginLeft: 10}}
                                               resizeMode="contain"></Image>
                                    </View>
                                    :
                                    null
                                }
                            </View>
                            :
                            <View style={{height:120,backgroundColor:"#ffffff",width:"100%",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                                {this.isFreeRegister ?
                                    <View style={{
                                        height: 50,
                                        width: "100%",
                                        flexDirection: "row",
                                        backgroundColor: "#ffffff"
                                    }}>
                                        <Icon name="user-circle" size={30} color="#f9e160"
                                              style={{textAlign: "center", margin: 10}}/>
                                        <TextInput autoFocus={true} style={{
                                            height: 50,
                                            backgroundColor: "#ffffff",
                                            width: "100%",
                                            color: "gray"
                                        }} underlineColorAndroid='transparent' defaultValue={""}
                                                   onChangeText={this.nameTextChange}/>
                                    </View>
                                    :
                                    <View style={{
                                        height: 50,
                                        width: "100%",
                                        flexDirection: "row",
                                        backgroundColor: "#ffffff"
                                    }}>
                                        <Icon name="lock" size={30} color="#f9e160"
                                              style={{textAlign: "center", margin: 10}}/>
                                        <TextInput autoFocus={true} style={{
                                            height: 50,
                                            backgroundColor: "#ffffff",
                                            width: "100%",
                                            color: "gray"
                                        }} underlineColorAndroid='transparent' defaultValue={""}
                                                   onChangeText={this.checkCodeTextChange}/>
                                    </View>
                                }
                                <View style={{width:"100%",height:0,borderTopWidth:1,borderColor:"#f9e160"}}></View>
                                <TouchableOpacity disabled={this.state.registering} onPress={this.register} style={{width:"90%",height:40,marginTop:24,borderColor:"#535353",backgroundColor:"#636363",borderWidth:1,borderRadius:5,flex:0,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                                    <Text style={{fontSize:16,textAlign:"center",color:"white"}}>{this.state.registering?this.state.registerStep:"完成"}</Text>
                                    {this.state.registering?<Image source={require('../../image/loading.gif')} style={{width:18,height:18,marginLeft:10}} resizeMode="contain"></Image>:null}
                                </TouchableOpacity>
                            </View>
                    }
                    <View style={{flex:1,width:"100%",backgroundColor:"#ffffff"}}>
                    </View>
                    <View style={{height:60,width:"100%",backgroundColor:"#f0f0f0",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                        <Text style={{color:"#a0a0a0",textAlign:"center",fontSize:10}}>版本：v{versionLocal}</Text>
                    </View>

                    <Modal visible={this.state.scanVisible}
                           onRequestClose={()=>{
                               this.setState({scanVisible:false})
                           }}
                    >
                        <ScanView onRead={this.onRead} onCancel={()=>{
                            this.setState({scanVisible:false});

                        }}

                        ></ScanView>
                    </Modal>
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
