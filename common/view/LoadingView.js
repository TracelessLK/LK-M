import React, {Component} from 'react';
import {
    ActivityIndicator,
    Alert,
    AsyncStorage,
    Button,
    NativeModules,
    Platform,
    StyleSheet, Text,
    View, Modal, ScrollView
} from 'react-native';
import PropTypes from 'prop-types'

const style = require('./style')

export default class LoadingView extends Component<{}> {

    constructor(props) {
        super(props);

        const loadingView = (
            <View style={style.allCenter} >
                <ActivityIndicator size="large" />
            </View>
        )

        this.state = {
            content:loadingView
        }

    }

    componentDidMount = () => {
        (async()=>{
            const content =  await this.props.getContentAsync()

            this.setState({
                content
            })
        })()
    }


    componentWillUnmount = () => {

    }

    render() {
        this.props.getContentAsync()
        return  this.state.content
    }

}

LoadingView.defaultProps = {

}

LoadingView.propTypes = {
    getContentAsync:PropTypes.func.isRequired,
}
