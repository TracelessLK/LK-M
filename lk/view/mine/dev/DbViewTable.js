import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, ScrollView, Text} from 'react-native'
import { Table, TableWrapper, Row } from 'react-native-table-component'

const _ = require('lodash')
const { engine } = require('@lk/LK-C')
const ChatManager = engine.get('ChatManager')



export default class DbViewTable extends Component<{}> {
    constructor(props) {
        super(props)
        this.state = {
            tableHead: [],
            tableData:[],
            noRecord: false,
            widthArr:[]
        }
        this.tablename = this.props.navigation.state.params.tablename
    }

    async componentDidMount() {
        const tableDataAry = await ChatManager.asyGetAllData(this.tablename)
        const datas = tableDataAry
        if(datas.length<1){
            this.setState({
                noRecord: true
            })
            return
        }
        const tableHead =[]
        const widthArr =[]
        for(let key in datas[0]){
            if(key=="id"||key=="ownerUserId"||key=="name"||key=="orgId"||key=="mCode"||key=="chatId"||key=="contactId"||key=="parentId"){
                tableHead.push(key)
                widthArr.push(400)
            }
        }
        const tableData = []
        for (let i = 0; i < datas.length; i += 1) {
            const data = datas[i]
            const rowData=[]
            for(let key in data){
                if(key=="id"||key=="ownerUserId"||key=="name"||key=="orgId"||key=="mCode"||key=="chatId"||key=="contactId"||key=="parentId"){
                    rowData.push(data[key])
                }
            }
            tableData.push(rowData)
        }
        this.setState({
            tableHead,
            tableData,
            widthArr
        })
    }

    componentWillUnmount() {

    }

    render() {
        const state = this.state
        const tableData1 = state.tableData
        const { navigation } = this.props
        const styles = StyleSheet.create({
            container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
            header: { height: 50, backgroundColor: '#537791' },
            text: { textAlign: 'center', fontWeight: '100' },
            dataWrapper: { marginTop: -1 },
            row: { height: 40, backgroundColor: '#E7E6E1' }
        })
        return (
            <View style={styles.container}>
                <ScrollView horizontal={true}>
                    <View>
                        <Table borderStTableyle={{borderColor: '#C1C0B9'}}>
                            <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.text}/>
                        </Table>
                        <ScrollView style={styles.dataWrapper}>
                            <Table borderStyle={{borderColor: '#C1C0B9'}}>
                                {
                                    tableData1.map((rowData, index) => (
                                        <Row
                                            key={index}
                                            data={rowData}
                                            widthArr={state.widthArr}
                                            style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                                            textStyle={styles.text}
                                        />
                                    ))
                                }
                            </Table>
                            {this.state.noRecord? <View>
                                <Text>
                                    no Record
                                </Text>
                            </View>:null}
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
        )
    }
}


DbViewTable.defaultProps = {}

DbViewTable.propTypes = {}


