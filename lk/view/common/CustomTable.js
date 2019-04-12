import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView
} from 'react-native'
import {Row, Table} from 'react-native-table-component'
import _ from 'lodash'

/*
   [
   {
     columnName: cellData
   },{}...]
  */
export default ({data}) => {
  let tableHead = []
  let widthArr = []
  if (data.length) {
    const first = data[0]
    tableHead = Object.keys(first)
    widthArr = Array(tableHead.length).fill(200, 0)
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'
    },
    header: { height: 50, backgroundColor: '#537791' },
    text: { textAlign: 'center', fontWeight: '100' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' }
  })


  const tableData = data.map(obj => _.values(obj).map(ele => {
    let result = ele
    if (String(ele).length > 100) {
      result = '内容太多无法展示'
    }
    return result
  }))

  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        <Table borderStTableyle={{ borderColor: '#C1C0B9' }}>
          <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
        </Table>
        <ScrollView>
          <Table borderStyle={{ borderColor: '#C1C0B9' }}>
            {
              tableData.map((rowData, index) => (
                <Row
                  key={String(index)}
                  data={rowData}
                  widthArr={widthArr}
                  style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}
                  textStyle={styles.text}
                />
              ))
            }
          </Table>
        </ScrollView>
      </View>
    </ScrollView>
  )
}
