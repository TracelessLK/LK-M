
import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';

export default class ExternalView extends Component<{}> {

    static navigationOptions =() => {
        return {
            headerTitle:"外部联系人"
        }
    }
    constructor(props){
        super(props);
        this.state={};
    }


    render() {
        return (
           <View>
               <Text>ExternalView</Text>
           </View>
        )
    }

}

ExternalView.defaultProps = {

}

ExternalView.propTypes = {

}
