import React, {Component} from 'react';
import {
  Text,
  View
} from 'react-native';

export default class NotifyView extends Component<{}> {

  static navigationOptions = () => {
    return {
      headerTitle: "通知"
    }
  }

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <View>
        <Text>ExternalView</Text>
      </View>
    )
  }

}

NotifyView.defaultProps = {}

NotifyView.propTypes = {}
