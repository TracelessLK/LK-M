import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import uuid from 'uuid'
import MineView from '../../../../lk/view/mine/MineView'
import UidView from '../../../../lk/view/mine/UidView'

jest.mock('../../../../lk/view/mine/MineView.js')
jest.mock('../../../../lk/view/mine/VersionView.js')

test('MineView test', () => {
  const mine = shallow(<MineView />)
  expect(mine)
})
test('uidView ', () => {
  renderer.create(
    <UidView uid={uuid()}/>
  )
})
