
import React, { Component } from 'react';
import {

} from 'react-native';
import PropTypes from 'prop-types'
import { SearchBar} from 'react-native-elements'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class Bar extends Component<{}> {

    constructor(props){
        super(props);
        this.clearIcon = { style:[{fontSize:20},this.props.clearIconStyle]}
        this.state={
            clearIcon :false
        };
    }

    componentDidMount(){

    }

    componentDidUpdate(){
    }


    componentWillUnmount(){

    }

    onChangeText = (t)=>{
        t = t.trim()
        if(this.props.onChangeText){
            this.props.onChangeText(t)
        }
        if(t){
            this.setState({
                clearIcon:this.clearIcon
            })
        }else{
            this.setState({
                clearIcon:false
            })
        }
    }

    render() {
        const {
            ...attributes
        } = this.props;
        delete attributes.onChangeText

        return (
            <SearchBar
                onChangeText={this.onChangeText}
                clearIcon={this.state.clearIcon}
                icon={{}}
                lightTheme
                placeholder='搜索'
                containerStyle={{backgroundColor:"#f0f0f0",display:'flex',}}
                inputStyle={ {
                    backgroundColor:"white",display:'flex',flex:1,
                    alignItems:"flex-start",justifyContent:"flex-start",color:"black"
                }}
                showLoadingIcon={false}
                ref={c=>{
                    this._input = c
                }}
                {...attributes}
            />
        )
    }

}

SearchBar.defaultProps = {

}

SearchBar.propTypes = {
    clearIconStyle:MaterialIcons.propTypes.style

}
