import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import CheckCodeView from '../../../../lk/view/auth/CheckCodeView'

jest.mock('../../../../lk/view/auth/CheckCodeView')

test('renderer create', () => {
  const tree = renderer.create(<CheckCodeView />).toJSON()
  expect(tree).toMatchSnapshot()
})
