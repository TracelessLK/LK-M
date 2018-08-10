import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView
} from 'react-native';
const lkApp = require('../../LKApplication').getCurrentApp()
const common = require('@hfs/common')
const {SearchBar,commonUtil,List} = common
const {debounceFunc} = commonUtil
import { ListItem} from 'react-native-elements'

export default class BasicInfoView extends Component<{}> {

    static navigationOptions = () => {
        return {
            headerTitle: "个人信息"
        }
    }

    constructor(props) {
        super(props);
        this.state = {};
        this.user = lkApp.getCurrentUser()
        console.log(this.user)

    }


    render() {
        const style = {
            listItem:{
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between",
                flexDirection:"row"
            },
            listStyle:{
                backgroundColor:'white',marginTop:20,
            },
            titleStyle:{
                fontSize:18,
                marginLeft:10
            },
            contentStyle:{
                color:"#a0a0a0",
                fontSize:18,
            },
            contentContainer:{
            }
        }
        const list2 = [
            {
                title: (
                    <View style={style.listItem}>
                        <View>
                            <Text style={style.titleStyle}>
                                标识
                            </Text>
                        </View>
                        <View style={style.contentContainer}>
                            <Text style={[style.contentStyle,{fontSize:14}]}>
                                {this.user.id}
                            </Text>
                        </View>

                    </View>),
                onPress:debounceFunc(()=>{
                    this.props.navigation.navigate('UidView',{
                        uid:this.user.id
                    })
                }),
            },

            {
                title: (
                    <View style={style.listItem}>
                        <View>
                            <Text style={style.titleStyle}>
                                昵称
                            </Text>
                        </View>
                        <View>
                            <Text style={style.contentStyle}>
                                {this.name}
                            </Text>
                        </View>
                    </View>),
                onPress:debounceFunc(()=>{
                    this.props.navigation.navigate('RenameView',{
                    })
                }),
                subtitle:this.name
            },
        ]

        return (
            <ScrollView >
                <View style={style.listStyle}>
                    {
                        list2.map((item, i) =>
                            <ListItem
                                key={i}
                                title={item.title}
                                component={item.label}
                                rightIcon={item.rightIconColor?{style:{color:item.rightIconColor}}:{}}
                                onPress={item.onPress}
                            />
                        )
                    }
                </View>
            </ScrollView>
        );
    }

}

BasicInfoView.defaultProps = {}

BasicInfoView.propTypes = {}
