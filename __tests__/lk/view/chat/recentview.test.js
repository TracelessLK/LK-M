import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import RecentView from '../../../../lk/view/chat/RecentView'

jest.mock('react-native-fetch-blob', () => 'RNFetchBlob')
jest.mock('react-native-device-info', () => 'DeviceInfo')
jest.mock('react-native-camera', () => 'Camera')
jest.mock('react-native-fs', () => 'RNFS')
jest.mock('react-native-update', () => {
  return {
    downloadUpdate: jest.fn(),
    switchVersion: jest.fn(),
    isFirstTime: jest.fn(),
    isRolledBack: jest.fn(),
    markSuccess: jest.fn()
  }
})

describe('RecentView', () => {
  let props = {
    navigation: {
      navigate: jest.fn(),
      setParams: jest.fn()
    }
  }
  test('renderer create', () => {
    const tree = renderer.create(
      <RecentView {...props}/>
    )
    expect(tree.toJSON()).toMatchSnapshot()
  })
  // describe('call function', () => {
  //   it('should render a asyGetAllDetainedMsg ready', () => {
  //     const wrapper = shallow(<RecentView {...props}/>)
  //     let option = {refreshControl: true, showWarning: true, minTime: 1000 }
  //     expect(wrapper.asyGetAllDetainedMsg(option)).toMatchSnapshot()
  //   })
  //   it('defaultContent function', () => {
  //     const wrapper = shallow(<RecentView {...props}/>)
  //     expect(wrapper.getDefaultContent()).toMatchSnapshot()
  //   })
  //   it('getConnectionMsg function', () => {
  //     const wrapper = shallow(<RecentView {...props}/>)
  //     expect(wrapper.getConnectionMsg()).toMatchSnapshot()
  //   })
  //   it('connectionOpen function', () => {
  //     const wrapper = shallow(<RecentView {...props}/>)
  //     expect(wrapper.connectionOpen()).toMatchSnapshot()
  //   })
  // })
})
