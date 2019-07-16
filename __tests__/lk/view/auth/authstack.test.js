import React from "react"
import renderer from 'react-test-renderer'
import StackNavigator from "../../../../lk/view/auth/AuthStack"

jest.mock('react-native-fs', () => 'RNFSFileTypeRegular')

describe('AuthStack Test', () => {
  test('readerer create', () => {
    const tree = renderer.create(<StackNavigator />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
