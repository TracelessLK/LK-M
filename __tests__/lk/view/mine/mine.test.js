import React from 'react'
import renderer from 'react-test-renderer'
import uuid from 'uuid'
import UidView from '../../../../lk/view/mine/UidView'

jest.mock('../../../../lk/view/mine/MineView.js')
jest.mock('../../../../lk/view/mine/VersionView.js')

describe('uidView', () => {
  test('uidView ', () => {
    let props = {
      navigation: {state: {params: {uid: uuid}}}
    }
    const tree = renderer.create(<UidView {...props}/>).toJSON()
    expect(tree).not.toBe('undefined')
  })
})
