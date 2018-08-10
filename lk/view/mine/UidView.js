
import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions
} from 'react-native';
import { Card} from 'react-native-elements'


export default class UidView extends Component<{}> {
    static navigationOptions = () => {
        return {
            headerTitle: "个人标识"
        }
    }
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
        const {width} = Dimensions.get('window')


        return (
            <View style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:80,}}>
                <Card title="个人身份唯一标识" style={{}}>
                    <View style={{marginHorizontal:5,marginTop:20,justifyContent:'center',alignItems:'center'}}>
                        <Text selectable style={{fontSize:width/28}} >
                            {this.props.navigation.state.params.uid}
                        </Text>
                    </View>
                </Card>

            </View>);

    }

}

UidView.defaultProps = {

}

UidView.propTypes = {

}
