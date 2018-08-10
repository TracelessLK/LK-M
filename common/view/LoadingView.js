
import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import ActivityIndicator from '../widget/ActivityIndicator'
const style = require('./style')
import PropTypes from 'prop-types'


export default class LoadingView extends Component<{}> {

    constructor(props){
        super(props);
        this.state = {
            content:null,
            loading:true
        }
    }

    componentDidMount(){
    }

    componentDidUpdate(){
    }


    componentWillUnmount(){

    }


    render() {
        return (
            <View style={style.allCenter}>
                {this.props.loading?(
                    <ActivityIndicator/>
                ):this.props.content}
            </View>
        )
    }
}

LoadingView.defaultProps = {
    loading:true
}

LoadingView.propTypes = {
    loading:PropTypes.bool,
    content:PropTypes.element
}
