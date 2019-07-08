import React from 'react'
import "react-native"
import renderer from 'react-test-renderer'
import uuid from 'uuid'
import UidView from '../../../../lk/view/mine/UidView'

describe('uidView', () => {
  test('uidView ', () => {
    let props = {
      navigation: {state: {params: {uid: uuid}}}
    }
    const tree = renderer.create(<UidView {...props}/>).toJSON()
    expect(tree).not.toBe(undefined)
  })
})
