import React, { Component } from 'react'
import {
  ScrollView, Text, View,
  PushNotificationIOS
} from 'react-native'
import { ListItem } from 'react-native-elements'

const { engine } = require('@lk/LK-C')
const common = require('@external/common')

const { commonUtil } = common
const { debounceFunc } = commonUtil
const ChatManager = engine.get('ChatManager')


export default class DbView extends Component<{}> {
  constructor(props) {
    super(props)
      this.state = {
        tableNameAry: []
      }
  }

  async componentDidMount() {
      const tableNameAry = await ChatManager.getAllTableAry()
      this.setState({
          tableNameAry
      })

  }

  render() {
    const { navigation } = this.props
    const style = {
      listItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
      },
      listStyle: {
        backgroundColor: 'white', marginTop: 20
      },
      titleStyle: {
        fontSize: 18,
        marginLeft: 10,
        color: '#606060'

      },
      contentStyle: {
        color: '#a0a0a0',
        fontSize: 18
      },
      contentContainer: {
      }
    }
    const ary =this.state.tableNameAry
    const list2 = ary.map(ele => ({
      title: (
          <View style={style.listItem}>
            <View>
              <Text style={style.titleStyle}>
                {ele}
              </Text>
            </View>
            <View>
              <Text style={style.contentStyle} />
            </View>
          </View>),
      onPress: ()=>{
        this.props.navigation.navigate('DbViewTable',{
          tablename:ele
        })
      }
    }))

    return (
      <ScrollView>
        <View style={style.listStyle}>
          {
              list2.map((item, i) => (
                <ListItem
                  key={i}
                  title={item.title}
                  component={item.label}
                  rightIcon={item.rightIconColor ? { style: { color: item.rightIconColor } } : {}}
                  onPress={item.onPress}
                />
              ))
            }
        </View>
      </ScrollView>
    )
  }
}
