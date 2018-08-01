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
import { Container, Header, Content, Input, Item,Button ,Icon,Label,Toast} from 'native-base';
const {debounceFunc} = require('../../../common/util/commonUtil')
const config = require('../../config')

export default class CheckCodeView extends Component<{}> {

    constructor(props) {

        super(props);
        const obj = this.props.navigation.state.params.obj

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

       this.text = t?t.trim():''

    }
    render() {
        return (
            <View style={{display:"flex",alignItems:'center',justifyContent:'center',flex:1}}>
                <View style={{display:'flex',justifyContent:"flex-start",alignItems:"flex-start",marginVertical:15,width:'95%'}}>
                    <Item floatingLabel >
                        <Label>请输入验证码</Label>
                        <Input ref='input' onChangeText={this.onChangeText}></Input>
                    </Item>
                </View>
                <View>
                    <Button ref='button' iconLeft  info style={{width:100,display:"flex",alignItems:'center',justifyContent:'center'}}

                            onPress={debounceFunc(()=>{
                                if(!this.text){
                                  Toast.show({
                                      text: '请输入验证码',
                                      position: "top",
                                      type:"warning",
                                      duration: 3000
                                  })
                                }else{
                                    const obj = this.props.navigation.state.params.obj
                                    obj.checkCode = this.text
                                    fetch(`${config.url}api/user/${obj.action}`, {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body:JSON.stringify(obj),
                                    }).then(response=>{
                                        (async()=>{
                                            const result = await response.json()
                                            const {errorMsg} = result
                                            if(errorMsg){
                                                Alert.alert("提示",errorMsg)
                                            }else{
                                                Alert.alert("提示","成功注册管理员,验证码即为登录密码")
                                                this.props.navigation.goBack()
                                            }
                                        })()

                                    }).catch(err=>{
                                        console.log(err)

                                    })
                                }


                    })}>
                        <Text style={{color:"white"}}>注册管理员</Text>
                    </Button>
                </View>

            </View>
        );
    }

}

CheckCodeView.defaultProps = {};

CheckCodeView.propTypes = {};
