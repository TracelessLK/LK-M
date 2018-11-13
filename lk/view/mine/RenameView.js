import React, {Component} from 'react'
import {
  View,
  ScrollView,
  TextInput
} from 'react-native'
import {Toast} from 'native-base'
const {engine} = require('LK-C')

const Application = engine.getApplication()
const lkApp = Application.getCurrentApp()
const style = require('../style')
const {HeaderRightButton} = require('@ys/react-native-collection')
const userManager = engine.get('UserManager')
const {FuncUtil} = require('@ys/vanilla')
const {debounceFunc} = FuncUtil

export default class RenameView extends Component<{}> {
    static navigationOptions = ({navigation}) => {
      // console.log(navigation.getParam('save'))
      const prop = {
        title: '保存',
        color: style.color.mainColor,
        onPress: navigation.getParam('save')
      }
      return {
        headerTitle: '修改昵称',
        headerRight: <HeaderRightButton {...prop}/>
      }
    }

    constructor (props) {
      super(props)
      this.state = {
        disabled: true
      }
      this.user = lkApp.getCurrentUser()
    }

    componentDidMount () {
      this.props.navigation.setParams({ save: debounceFunc(async () => {
        if (typeof this.refs.input._lastNativeText === 'undefined') {
          Toast.show({
            text: '请修改昵称后保存',
            position: 'top'
          })
        } else if (!this.refs.input._lastNativeText) {
          Toast.show({
            text: '昵称不能为空',
            position: 'top'
          })
        } else {
          await userManager.setUserName(this.refs.input._lastNativeText)
          this.props.navigation.goBack()
        }
      }) })
    }

    onChangeText = (t) => {
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
            <TextInput onChangeText={this.onChangeText} ref="input" style={{fontSize: 18}} autoFocus defaultValue={this.user.name}/>
          </View>
        </ScrollView>
      )
    }
}

RenameView.defaultProps = {}

RenameView.propTypes = {}
