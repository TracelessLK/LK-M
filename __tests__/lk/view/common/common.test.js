import React from 'react'
import renderer from 'react-test-renderer'
import ScreenWrapper from '../../../../lk/view/common/ScreenWrapper'

jest.mock('../../../../lk/view/common/ScanView.js')
jest.mock('../../../../lk/view/common/NetIndicator.js')
jest.mock('../../../../lk/view/common/NavigateList.js')
jest.mock('../../../../lk/view/common/CustomTable.js')
jest.mock('../../../../lk/view/common/ScreenWrapper.js')


test('ScreenWrapper is test', () => {
  renderer.create(
    <ScreenWrapper />
  )
})
