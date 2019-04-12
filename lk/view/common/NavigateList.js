import React from 'react'
import {
  ScrollView,
  Text,
  View
} from 'react-native'
import { ListItem } from 'react-native-elements'
import _ from 'lodash'


export default ({
  itemAry = []
}) => {
  const list = itemAry.map((ele) => {
    const { title, onPress, pressOnce = true } = ele
    return {
      title: (
        <View style={style.listItem}>
          <View>
            <Text style={style.titleStyle}>
              {title}
            </Text>
          </View>
          <View>
            <Text style={style.contentStyle} />
          </View>
        </View>),
      // 默认只能点击一次
      onPress: pressOnce ? _.once(onPress) : onPress
    }
  })
  return (
    <ScrollView>
      <View style={style.listStyle}>
        {
          list.map((item, i) => (
            <ListItem
              key={String(i)}
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
