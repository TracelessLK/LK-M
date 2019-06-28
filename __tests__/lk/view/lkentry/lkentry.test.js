import React from 'react'
import renderer from 'react-test-renderer'
import {Platform} from "react-native"
import EntryView from '../../../../lk/view/index/EntryView'

jest.mock('../../../../lk/view/index/EntryView')

test('renders Regular EntryView', () => {
  const schemeName = 'lkapp'
  const prefix = Platform.OS === 'android' ? `${schemeName}://${schemeName}/` : `${schemeName}://`
  renderer.create(
    <EntryView uriPrefix={prefix}/>
  )
})
