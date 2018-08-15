/* eslint-enable */


import React, { Component } from 'react';
import {
    Image,
    View
} from 'react-native';
import commonUtil from "../util/commonUtil"
const {getAvatarSource} = commonUtil
import PropTypes from 'prop-types'


export default class GroupAvatar extends Component<{}> {

    constructor(props){
        super(props);
    }


    render() {
        let {picAry,defaultPic} = this.props

        if(picAry.length > 4){
            picAry = picAry.slice(0,4)
        }
        let avatarAry = []
        for(let i=0;i<picAry.length;i++){
            let pic = picAry[i]
            if(i ===0 && picAry.length===3 ){
                avatarAry.push(<Image  key={i} source={getAvatarSource(pic,defaultPic)} style={{width:22,height:22,margin:0.5,marginHorizontal:10,borderRadius:1}} resizeMode="contain"></Image>)

            }else{
                avatarAry.push(<Image  key={i} source={getAvatarSource(pic,defaultPic)} style={{width:22,height:22,margin:0.5,borderRadius:1}} resizeMode="contain"></Image>)
            }

        }

        return   (
            <View style={{display:'flex',justifyContent:"center",alignItems:"center",flexDirection:"row",
                borderWidth:1,borderRadius:1,borderColor:"#e0e0e0",backgroundColor:"#f0f0f0",width:51,height:51,marginBottom:20,
                flexWrap:"wrap",padding:1
            }}>
                {avatarAry}
            </View>
        )
    }

}

GroupAvatar.defaultProps = {

}

GroupAvatar.propTypes = {

    picAry:PropTypes.array,
    defaultPic:PropTypes.node

}
