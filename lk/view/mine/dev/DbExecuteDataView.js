import React from 'react'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import {
  StyleSheet, View, Text
} from 'react-native'
import CustomeTable from '../../common/CustomTable'
import ScreenWrapper from '../../common/ScreenWrapper'

const { engine } = require('@lk/LK-C')

const ChatManager = engine.ChatManager


export default class DbExecuteDataView extends ScreenWrapper {
    state = {
      tableDataAry: [],
      noRecord: false,
      totalCount: ''
    }

    sql = this.props.navigation.state.params.sql

    async componentDidMount() {
      console.log("this.sql:", this.sql)
      const tableDataAry = await ChatManager.runSql(this.sql)
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

    subRender() {
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
          <AndroidBackHandler onBackPress={() => {
            this.props.navigation.goBack()
            return true
          }}
                />
        </View>
      )
    }
}


DbExecuteDataView.defaultProps = {}

DbExecuteDataView.propTypes = {}
