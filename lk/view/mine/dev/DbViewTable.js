import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import {
  StyleSheet, View, ScrollView, Text
} from 'react-native'
import CustomeTable from '../../common/CustomTable'

const { engine } = require('@lk/LK-C')

const ChatManager = engine.get('ChatManager')


export default class DbViewTable extends Component<{}> {
  state = {
    tableDataAry: [],
    noRecord: false,
    totalCount: ''
  }

  tablename = this.props.navigation.state.params.tablename

  async componentDidMount() {
    const tableDataAry = await ChatManager.asyGetAllData(this.tablename)
    const totalCount = tableDataAry.length
    let noRecord = false
    if (!totalCount) {
      noRecord = true
    }
    this.setState({
      totalCount,
      noRecord
    })
    setTimeout(() => {
      this.setState({
        tableDataAry
      })
    }, 0)
  }

  componentWillUnmount() {

  }

  render() {
    const {tableDataAry} = this.state
    const styles = StyleSheet.create({
      container: {
        flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'
      },
      header: { height: 50, backgroundColor: '#537791' },
      text: { textAlign: 'center', fontWeight: '100' },
      dataWrapper: { marginTop: -1 },
      row: { height: 40, backgroundColor: '#E7E6E1' }
    })
    return (
      <View style={styles.container}>
        <View style={{margin: 5}}>
          <Text>表名: {this.tablename}</Text>
        </View>
        <View style={{margin: 5}}>
          <Text>总计: {this.state.totalCount} 条</Text>
        </View>
        {this.state.noRecord ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text>
              no record
            </Text>
          </View>
        )
          : <CustomeTable data={tableDataAry} />
        }
        <AndroidBackHandler onBackPress={()=>{
          this.props.navigation.goBack()
          return true
        }} />
      </View>
    )
  }
}


DbViewTable.defaultProps = {}

DbViewTable.propTypes = {}
