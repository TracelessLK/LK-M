import React from "react"
import 'react-native'
import renderer from 'react-test-renderer'
import SetPasswordView from "../../../../lk/view/auth/SetPasswordView"

describe('SetPasswordView Test', () => {
  test('renderer create', () => {
    const tree = renderer.create(<SetPasswordView/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
