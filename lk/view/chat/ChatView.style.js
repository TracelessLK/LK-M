import {StyleSheet} from 'react-native'

/*
   show border
   borderColor: 'black', borderWidth: 1
 */

export const iconSize = 25
export const iconColor = '#808080'

const iconButtonSize = 60
const center = {
  alignItems: 'center',
  justifyContent: 'center'
}

const obj = {
  img: {

  },
  iconButton: {
    ...center,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 5,
    borderRadius: 10,
    width: iconButtonSize,
    height: iconButtonSize,
    marginBottom: 5
  },
  iconButtonWrap: {
    ...center
  }
}

export default StyleSheet.create(obj)
