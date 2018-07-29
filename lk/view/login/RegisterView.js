import React, {Component} from 'react';
import {
    Alert,
    AsyncStorage,
    NativeModules,
    Platform,
    StyleSheet, Text,
    View, Modal, ScrollView,TextInput
} from 'react-native';
import PropTypes from 'prop-types'
import RNFS from 'react-native-fs';
import { Container, Header, Content, Input, Item,Button ,Icon,Label,Toast} from 'native-base';
import RSAKey from "react-native-rsa";
const {debounceFunc} = require('../../../common/util/commonUtil')
const config = require('../../config')
const lkApplication = require('../../LKApplication').getCurrentApp()

const uuid = require('uuid')
const deviceInfo = require('react-native-device-info')
const pushUtil = require('../../../common/util/pushUtil')
const AppUtil = require('../../AppUtil.js')


export default class CheckCodeView extends Component<{}> {

    constructor(props) {
        super(props);
        const obj = this.props.navigation.state.params.obj
        console.log(obj)


        this.state = {
            hasCheckCode:obj.hasCheckCode
        };

    }

    componentDidMount = () => {

    }

    componentWillUnmount = () => {
    }


    componentWillUnmount = () => {

    }
    onChangeText = (t)=>{

        this.name = t?t.trim():''

    }
    onChangeText2 = (t)=>{

        this.checkCode = t?t.trim():''

    }
    onChangeText3 = (t)=>{

        this.password = t?t.trim():''

    }

    render() {
        return (
            <View style={{display:"flex",alignItems:'center',justifyContent:'center',flex:1}}>
                <View style={{display:'flex',justifyContent:"flex-start",alignItems:"flex-start",marginVertical:15,width:'95%'}}>
                    {this.state.hasCheckCode? (
                        <Item floatingLabel  >
                            <Label>请输入验证码</Label>
                            <Input ref='input' onChangeText={this.onChangeText2}></Input>
                        </Item>

                        ) :null}
                    <Item floatingLabel  >
                        <Label>请设置登录密码</Label>
                        <Input ref='input' onChangeText={this.onChangeText3}></Input>
                    </Item>
                </View>
                <View>
                    <Button ref='button' iconLeft  info style={{width:100,display:"flex",alignItems:'center',justifyContent:'center'}}
                            onPress={debounceFunc(()=>{
                                if(!this.checkCode && this.state.hasCheckCode) {
                                    Toast.show({
                                        text: '请输入验证码',
                                        position: "top",
                                        type: "warning",
                                        duration: 3000
                                    })

                                }else if(!this.password){
                                    Toast.show({
                                        text: '请设置登录密码',
                                        position: "top",
                                        type: "warning",
                                        duration: 3000
                                    })
                                }else{
                                    const {obj,qrcode} = this.props.navigation.state.params

                                    const LKWSChannelClass = lkApplication.getLKWSChannelClass()
                                    //ws://www.host.com/path
                                    const wsChannel = new LKWSChannelClass(`ws://${obj.ip}:${obj.port}`)



                                    const bits = 1024;
                                    const exponent = '10001';
                                    let rsa = new RSAKey();
                                    rsa.generate(bits, exponent);
                                    const publicKey = rsa.getPublicString(); // return json encoded string
                                    const privateKey = rsa.getPrivateString(); // return js

                                    (async()=>{
                                        try{
                                            const password = await RNFS.hash(this.password,'md5')
                                            const user = {
                                                id:obj.id,
                                                name:obj.name,
                                                publicKey,
                                                privateKey,
                                                deviceId:uuid(),
                                                serverIP:obj.ip,
                                                serverPublicKey:obj.serverPublicKey,
                                                serverPort:obj.port,
                                                orgId:obj.orgId,
                                                mCode:obj.mCode,
                                                password
                                            }

                                            const venderDid = await pushUtil.getAPNDeviceId()

                                            const result =  await wsChannel.asyRegister(obj.ip,obj.port,user.id,user.deviceId,venderDid,publicKey,this.checkCode,qrcode)
                                            const userhandler = lkApplication.getLKUserHandler()

                                            //id,name,pic,publicKey,privateKey,deviceId,serverIP,serverPort,serverPublicKey,orgId,mCode,password,reserve1
                                            await userhandler.asyAddLKUser(user)
                                            AppUtil.reset()

                                        }catch(error){
                                            const errStr = JSON.stringify(error)
                                            console.log(errStr)

                                            Alert.alert(errStr)
                                        }

                                    })()
                                }


                            })}>
                        <Text style={{color:"white"}}>注册</Text>
                    </Button>
                </View>

            </View>
        );
    }

}

CheckCodeView.defaultProps = {};

CheckCodeView.propTypes = {};
