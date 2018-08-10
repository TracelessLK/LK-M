
import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import PropTypes from 'prop-types'


export default class List extends Component<{}> {

    constructor(props){
        super(props);
        this.state={};
    }

    componentDidMount(){

    }

    componentDidUpdate(){
    }


    componentWillUnmount(){

    }

    render() {
        return (
            <View style={{backgroundColor:"white",borderBottomColor:"#f0f0f0",borderBottomWidth:1}} key={i+"org"}>
                <TouchableOpacity  onPress={()=>{
                    this.go2OrgView(org)
                }} style={{width:"100%",flexDirection:"row",justifyContent:"flex-start",height:55,
                    alignItems:"center",}} >
                    <Image resizeMode="cover" style={{width:45,height:45,margin:5,borderRadius:5}} source={require('../image/folder.png')} />
                    <View style={{flexDirection:"row",width:"80%",justifyContent:"space-between",alignItems:"center",marginHorizontal:10}}>
                        <Text style={{fontSize:18,fontWeight:"500"}}>
                            {org.name}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

}

List.defaultProps = {

}

List.propTypes = {
    data:PropTypes.array
}
