import React from 'react'
import renderer from 'react-test-renderer'
import RecentView from '../../../../lk/view/chat/RecentView'
import "react-native"

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
jest.setTimeout(1000)
describe('RecentView tests', () => {
  beforeEach(() => {
    jest.resetModules()
  })
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
  describe('call function', () => {
    it('onBackPress', () => {
      const node = new RecentView(props)
      expect(node.onBackPress()).toMatchSnapshot()
    })
    it('optionToChoose', () => {
      const node = new RecentView(props)
      expect(node.optionToChoose()).toMatchSnapshot()
    })
    it('updateListener', () => {
      const node = new RecentView(props)
      expect(node.updateListener()).toMatchSnapshot()
    })
    it('msgBadgeChangedListener', () => {
      const node = new RecentView(props)
      let params = {
        param: jest.fn()
      }
      expect(node.msgBadgeChangedListener(params)).toMatchSnapshot()
    })
    it('netStateChangedListener', () => {
      const node = new RecentView(props)
      let option = {
        param: jest.fn()
      }
      expect(node.netStateChangedListener(option)).toMatchSnapshot()
    })
    it('componentDidMount', () => {
      const node = new RecentView(props)
      expect(node.componentDidMount()).toMatchSnapshot()
    })
    it('_handleAppStateChange', () => {
      const node = new RecentView(props)
      let appState = jest.fn()
      expect(node._handleAppStateChange(appState)).toMatchSnapshot()
    })
    it('connectionFail', () => {
      const node = new RecentView(props)
      expect(node.connectionFail()).toMatchSnapshot()
    })
    it('getDefaultContent', () => {
      const node = new RecentView(props)
      expect(node.getDefaultContent()).toMatchSnapshot()
    })
    it('updateRecent', () => {
      const node = new RecentView(props)
      node.setState({
        contentAry: jest.fn(),
        refreshing: jest.fn()
      })
      expect(node.updateRecent()).toMatchSnapshot()
    })
    it('addActivityIndicator', () => {
      const node = new RecentView(props)
      expect(node.addActivityIndicator()).toMatchSnapshot()
    })
    it('asyGetAllDetainedMsg', () => {
      const node = new RecentView(props)
      const option = jest.fn()
      expect(node.asyGetAllDetainedMsg(option)).toMatchSnapshot()
    })
    it('resetHeaderTitle', () => {
      const node = new RecentView(props)
      const num = jest.fn()
      expect(node.resetHeaderTitle(num)).toMatchSnapshot()
    })
    it('getConnectionMsg', () => {
      const node = new RecentView(props)
      expect(node.getConnectionMsg()).toBe('当前网络不可用,请检查您的网络设置')
    })
    // it('componentWillUnmount', () => {
    //   const node = new RecentView(props)
    //   node.setState({
    //     contentAry: jest.fn(),
    //     refreshing: jest.fn()
    //   })
    //   expect(node.componentWillUnmount()).toMatchSnapshot()
    // })
  })
})
