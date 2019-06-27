import React, {Component} from 'react'
import {
  View,
  ScrollView,
  TextInput
} from 'react-native'
import {Toast} from 'native-base'

const {engine} = require('@lk/LK-C')

const style = require('../style')
const {HeaderRightButton} = require('@ys/react-native-collection')

const chatManager = engine.ChatManager
const {FuncUtil} = require('@ys/vanilla')

const {debounceFunc} = FuncUtil

export default class GroupRenameView extends Component<{}> {
    static navigationOptions = ({navigation}) => {
      // console.log(navigation.getParam('save'))
      const prop = {
        title: '保存',
        color: style.color.mainColor,
        onPress: navigation.getParam('save')
      }
      return {
        headerTitle: '群名片',
        headerRight: <HeaderRightButton {...prop}/>
      }
    }

    constructor (props) {
      super(props)
      this.state = {
        disabled: true
      }
      const { id, name} = this.props.navigation.state.params
      this.chatId = id
      this.groupName = name
    }

    componentDidMount () {
      this.props.navigation.setParams({ save: debounceFunc(async () => {
        if (typeof this.refs.input._lastNativeText === 'undefined') {
          Toast.show({
            text: '请修改群名称后保存',
            position: 'top'
          })
        } else if (!this.refs.input._lastNativeText) {
          Toast.show({
            text: '群名称不能为空',
            position: 'top'
          })
        } else if (this.refs.input._lastNativeText.indexOf(" ") >= 0) {
          Toast.show({
            text: '群名称不能为空格',
            position: 'top'
          })
        } else {
          await chatManager.asySetGroupName(this.chatId, this.refs.input._lastNativeText)
          this.props.navigation.goBack()
        }
      })
      })
    }

    onChangeText = () => {
      // if(t === Store.getCurrentName()){
      //     this.setState({
      //         disabled:true
      //     })
      // }else if(this.state.disabled){
      //     this.setState({
      //         disabled:false
      //     })
      // }

    }

    render () {
      return (
        <ScrollView >
          <View style={{backgroundColor: 'white', marginVertical: 20, width: '100%', padding: 12}}>
            <TextInput onChangeText={this.onChangeText} ref="input" style={{fontSize: 18}} autoFocus defaultValue={this.groupName}/>
          </View>
        </ScrollView>
      )
    }
}

GroupRenameView.defaultProps = {}

GroupRenameView.propTypes = {}
