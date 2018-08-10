
import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import PropTypes from 'prop-types'
const uuid = require('uuid')
import FastImage from 'react-native-fast-image'

export default class List extends Component<{}> {

    constructor(props){
        super(props);
        this.state={
        };
    }

    componentDidMount(){


    }

    componentDidUpdate(){
    }


    componentWillUnmount(){

    }

    render() {
        const contentAry = []
        for(let ele of this.props.data){
            const {onPress,image,title,key} = ele
            const content = (
                <View style={{backgroundColor:"white",borderBottomColor:"#f0f0f0",borderBottomWidth:1}} key={key}>
                    <TouchableOpacity  onPress={onPress} style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",height:55,
                        alignItems:"center",}} >
                        <FastImage resizeMode="cover" style={{width:45,height:45,margin:5,borderRadius:5}} source={image} />
                        <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginHorizontal:10}}>
                            <Text style={{fontSize:18,fontWeight:"500"}}>
                                {title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
            contentAry.push(content)
        }
        return contentAry
    }

}

List.defaultProps = {

}

List.propTypes = {
    /*
     * [{
     *  onPress:(ele)=>{},
     *  image:require('../image/folder.png',
     *  title:''
     *
     * }]
     *
     *
     *
     */

    data:PropTypes.array

}
