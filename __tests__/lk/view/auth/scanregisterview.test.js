import React from "react"
import renderer from 'react-test-renderer'
import ScanRegisterView from "../../../../lk/view/auth/ScanRegisterView"

jest.mock('react-native-vector-icons', () => 'Icon')

describe('ScanRegisterView Test', () => {
  let props = {
    navigation: {navigate: jest.fn()}
  }
  test('ScanRegisterView create', () => {
    const tree = renderer.create(<ScanRegisterView {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
  // test('ScanRegisterView create', () => {
  //   const node = new ScanRegisterView()
  //   let error = {_40: 0, _55: null, _65: 0, _72: null}
  //   expect(node.onRead()).toEqual(error)
  // })
})
