import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    TextInput
} from 'react-native';
import {Toast,Button} from "native-base";
const common = require('@hfs/common')
const lkApp = require('../../LKApplication').getCurrentApp()
const {SearchBar,commonUtil,List} = common
const {debounceFunc} = commonUtil
const style = require('../style')

export default class RenameView extends Component<{}> {

    static navigationOptions = (navigation) => {
        return {
            headerTitle: "修改昵称",
            headerRight:(
                <View style={{marginHorizontal:10}}>
                    <Button  light small style={{paddingHorizontal:8}} onPress={debounceFunc(()=>{
                        navigation.state.params.save()
                    })}>
                        <Text style={{color:style.color.mainColor,fontWeight:"bold"}}>保存</Text>
                    </Button>
                </View>

            )
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            disabled:true
        }
        this.user = lkApp.getCurrentUser()
    }


    componentDidMount(){
        this.props.navigation.setParams({ save:()=>{
                if(typeof this.refs.input._lastNativeText === "undefined"){
                    Toast.show({
                        text: '请修改昵称后保存',
                        position:"top"
                    })
                }else if(!this.refs.input._lastNativeText){
                    Toast.show({
                        text: '昵称不能为空',
                        position:"top"
                    })
                }else{
                    // WSChannel.setPersonalName(this.refs.input._lastNativeText,(data)=>{
                    //     const {err} = data
                    //     if(err){
                    //         console.log(err)
                    //         Toast.show({
                    //             text: `设置昵称失败,请稍后重试`,
                    //             position:"top"
                    //         })
                    //     }else{
                    //
                    //         this.props.navigation.goBack()
                    //     }
                    // },()=>{
                    //     Toast.show({
                    //         text: '设置昵称超时,请稍后重试',
                    //         position:"top"
                    //     })
                    // })
                }
            } })
    }


    onChangeText = (t)=>{
        // if(t === Store.getCurrentName()){
        //     this.setState({
        //         disabled:true
        //     })
        // }else if(this.state.disabled){
        //     this.setState({
        //         disabled:false
        //     })
        // }

    }


    render() {

        return (
            <ScrollView >
                <View style={{backgroundColor:"white",marginVertical:20,width:"100%",padding:12}}>
                    <TextInput  onChangeText={this.onChangeText} ref="input"  style={{fontSize:18}} autoFocus defaultValue={this.user.name}/>
                </View>
            </ScrollView>
        );
    }
}

RenameView.defaultProps = {}

RenameView.propTypes = {}

