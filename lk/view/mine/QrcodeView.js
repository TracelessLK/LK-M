
import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';
import PropTypes from 'prop-types'
const {getAvatarSource} = require("../../util")


export default class QrcodeView extends Component<{}> {

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
           <View>
               <Text>QrcodeView</Text>
           </View>
        )
    }

}

QrcodeView.defaultProps = {

}

QrcodeView.propTypes = {

}
