
import React, {  } from 'react';
import {
    View,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const lkStyle = require('../style')

const navigatorUtil = {

    getTabLogo(title,focused,iconName,iconSize=26){
        let color = focused?lkStyle.color.mainColor:"#a0a0a0"
        let style = {display:"flex",justifyContent:"center",alignItems:"center"}

        return(
            <View style={style}>
                <Icon name={iconName} size={iconSize}  color={color}/>
                <Text style={{fontSize:10, color}}>{title}</Text>
            </View>
        )
    }
}

Object.freeze(navigatorUtil)

module.exports = navigatorUtil
