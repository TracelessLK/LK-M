import React from 'react'
import renderer from 'react-test-renderer'
import UidView from '../../../../lk/view/mine/UidView'

jest.mock('../../../../lk/view/mine/MineView.js')
jest.mock('../../../../lk/view/mine/VersionView.js')


test('uidView ', () => {
  renderer.create(
    <UidView />
  )
})
