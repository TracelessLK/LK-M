
import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Switch
} from 'react-native'
import PropTypes from 'prop-types'

export default class List extends Component<{}> {
  constructor (props) {
    super(props)
    this.state = {
      selected: {}
    }
    this.selectedObj = {}
  }

  select = (value, key, extra) => {
    // console.log(value, key, extra)
    const selected = this.state.selected
    selected[key] = value
    if (value) {
      this.selectedObj[key] = extra
    } else {
      delete this.selectedObj[key]
    }
    this.props.onSelectedChange(this.selectedObj)
    this.setState({
      selected
    })
  }

  render () {
    const contentAry = []
    const {data, showSwitch} = this.props
    for (let ele of data) {
      const {onPress, image, title, key, extra} = ele
      const content = (
        <View style={{backgroundColor: 'white', borderBottomColor: '#f0f0f0', borderBottomWidth: 1}} key={key}>
          <TouchableOpacity onPress={onPress} style={{width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            height: 55,
            alignItems: 'center'}} >
            <Image resizeMode="cover" style={{width: 45, height: 45, margin: 5, borderRadius: 5}} source={image} />
            <View style={{flexDirection: 'row', width: '80%', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10}}>
              <Text style={{fontSize: 18, fontWeight: '500'}}>
                {title}
              </Text>
              {showSwitch ? <Switch onValueChange={(value) => { this.select(value, key, extra) }} value={this.state.selected[key]} ios_backgroundColor='#5077AA'></Switch>: null}
            </View>
          </TouchableOpacity>
        </View>
      )
      contentAry.push(content)
    }
    return contentAry
  }
}

List.defaultProps = {
  showSwitch: false,
  onSelectedChange: null
}

List.propTypes = {
  /*
     * [{
     *  onPress:(ele)=>{},
     *  image:require('../image/folder.png',
     *  title:''
     *
     * }]
     *
     *
     *
     */

  data: PropTypes.array,
  showSwitch: PropTypes.bool,
  onSelectedChange: PropTypes.func

}
