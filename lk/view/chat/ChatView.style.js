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
  },
  recordEleStyle: {
    flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%', marginTop: 15
  },
  msgBoxStyle: {
    maxWidth: 200,
    borderWidth: 0,
    backgroundColor: '#f9e160',
    borderRadius: 5,
    marginLeft: -2,
    minHeight: 40,
    padding: 5,
    overflow: 'hidden'
  }
}
// todo: export
// export default StyleSheet.create(obj)
/*
  {
  "img": 167,
  "iconButton": 168,
  "iconButtonWrap": 169,
  "recordEleStyle": 170,
  "msgBoxStyle": 171
}
   */
export default obj
