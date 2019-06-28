import React from 'react'
import renderer from 'react-test-renderer'
import {Platform} from "react-native"

const EntryView = require('../../../../lk/view/index/EntryView')

test('renders Regular EntryView', () => {
  const schemeName = 'lkapp'
  const prefix = Platform.OS === 'android' ? `${schemeName}://${schemeName}/` : `${schemeName}://`
  const tree = renderer.create(
    <EntryView uriPrefix={prefix}/>
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
