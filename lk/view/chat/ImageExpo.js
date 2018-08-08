import React, {Component} from 'react';
import {
    Alert,
    CameraRoll,
    Modal
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import PropTypes from 'prop-types'


export default class ImageExpo extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            visible:false
        };
    }


    render() {
        return (
            <Modal visible={this.state.visible} transparent={false}   animationType={"fade"}
            >
                <ImageViewer imageUrls={this.props.imageUrls}
                             onClick={()=>{this.setState({visible:false})}}
                             onSave={(url)=>{

                                 CameraRoll.saveToCameraRoll(url)
                                 Alert.alert(
                                     '',
                                     '图片成功保存到系统相册',

                                     { cancelable: true }
                                 )
                             }}
                             index={this.props.index}
                />
            </Modal>
        );
    }

}

ImageExpo.defaultProps = {
    visible:false,
    index:0
};

ImageExpo.propTypes = {
    visible: PropTypes.bool,
    index:PropTypes.number
};
