
import React from 'react'
import {
  Alert
} from 'react-native'
import ScreenWrapper from '../../common/ScreenWrapper'
import NavigateList from '../../common/NavigateList'
import { Toast } from 'native-base'

const Util = require('../../../util')

export default class DevView extends ScreenWrapper {
    static navigationOptions =() => ({
      headerTitle: 'DbDevView'
    })

    subRender() {
      const ary = [
        {
          title: 'delete group',
          onPress() {
            const sql1 = `
                delete from groupMember
              `
            const sql2 = ` delete from chat where isGroup = 1`

            Promise.all([Util.query(sql1), Util.query(sql2)]).then((result) => {
              console.log(result)
              Toast.show({
                text: 'sql executed successfully'
              })
            }).catch(() => {
              Alert.alert('error occured, check console for more infomation')
            })
          }
        }
      ]

      return <NavigateList itemAry={ary} />
    }
}
