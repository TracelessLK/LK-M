import React from 'react';
import { Text,View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class Tab extends React.Component {

    constructor(props) {
        super(props);
        this.type=props.type;
        this.focused=props.focused;
    }
    componentDidMount =()=> {

    }

    componentWillUnmount =()=> {

    }


    render() {
        let icon = this.focused?this.getIcon("#f9e160") :this.getIcon("#d0d0d0");
        let redTip = null;
        if(this.props.badge !== 0){
                redTip = (
                    <View style={{width:16,height:16,borderRadius:16,backgroundColor:"red",overflow:"hidden",position:"absolute",right:1,top:1,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                        <Text style={{fontSize:10,color:"#ffffff",textAlign:"center"}}>{this.props.badge}</Text>
                    </View>
                )
        }
        return<View style={{height:26,width:26}}>
            {icon}{redTip}
        </View>;
    }

    getIcon(color) {
        return <Icon name="message-outline" size={26} color={color} style={{position: "absolute", right: 1}}/>;
    }
}
