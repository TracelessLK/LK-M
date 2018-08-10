import React, {Component} from 'react';
import {
    Alert,
    Text,
    View
} from 'react-native';
import { Input, Item,Button ,Label,Toast} from 'native-base';
import RSAKey from "react-native-rsa";
const {debounceFunc} = require('../../../common/util/commonUtil')
const lkApplication = require('../../LKApplication').getCurrentApp()

const uuid = require('uuid')
import deviceInfo from 'react-native-device-info'
const pushUtil = require('../../../common/util/pushUtil')
const md5 = require("crypto-js/md5");



export default class RegisterView extends Component<{}> {

    constructor(props) {
        super(props);
        const obj = this.props.navigation.state.params.obj
        console.log(obj)
        

        this.state = {
            hasCheckCode:obj.hasCheckCode
        };

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
            <View style={{display:"flex",alignItems:'center',justifyContent:'flex-start',flex:1,marginTop:200}}>
                <View style={{display:'flex',justifyContent:"flex-start",alignItems:"flex-start",marginVertical:15,width:'95%'}}>
                    {this.state.hasCheckCode? (
                        <Item floatingLabel  >
                            <Label>请输入验证码</Label>
                            <Input ref='input' onChangeText={this.onChangeText2}></Input>
                        </Item>

                        ) :null}
                    <Item floatingLabel  >
                        <Label>请为您的密钥设置密码</Label>
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
                                        text: '请为您的密钥设置密码',
                                        position: "top",
                                        type: "warning",
                                        duration: 3000
                                    })
                                }else{
                                    const {obj,qrcode} = this.props.navigation.state.params

                                    const bits = 1024;
                                    const exponent = '10001';
                                    let rsa = new RSAKey();
                                    rsa.generate(bits, exponent);
                                    const publicKey = rsa.getPublicString(); // return json encoded string
                                    const privateKey = rsa.getPrivateString(); // return js

                                    (async()=>{
                                        const password = md5(this.password).toString()

                                        const user = {
                                            id:obj.id,
                                            name:obj.name,
                                            publicKey,
                                            privateKey,
                                            deviceId:uuid(),
                                            serverIP:obj.ip,
                                            serverPort:obj.port,
                                            orgId:obj.orgId,
                                            mCode:obj.mCode,
                                            password
                                        }

                                        const description = {
                                            brand:deviceInfo.getBrand(),
                                            device:deviceInfo.getDeviceId()
                                        }

                                        const venderDid = await pushUtil.getAPNDeviceId()

                                        lkApplication.asyRegister(user,venderDid,this.checkCode,qrcode,JSON.stringify(description,null,2)).then((user)=>{
                                            lkApplication.setCurrentUser(user)
                                            this.props.navigation.navigate('MainStack')

                                        }).catch(error=>{
                                            const errStr = JSON.stringify(error)
                                            console.log(error)

                                            Alert.alert(errStr)
                                        })



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

RegisterView.defaultProps = {};

RegisterView.propTypes = {};
