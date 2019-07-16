import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import ChatView from '../../../../lk/view/chat/ChatView'

jest.mock('react-native-fetch-blob', () => {
  return {
    DocumentDir: () => {},
    fetch: () => {},
    base64: () => {},
    android: () => {},
    ios: () => {},
    config: () => {},
    session: () => {},
    fs: {
      dirs: {
        MainBundleDir: () => {},
        CacheDir: () => {},
        DocumentDir: () => {}
      }
    },
    wrap: () => {},
    polyfill: () => {},
    JSONStream: () => {}
  }
})
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

describe('ChatView test', () => {
  let props = {
    navigation: {state: {params: jest.fn()}}
  }
  test('renderer create', () => {
    const tree = renderer.create(<ChatView {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
  describe('call function', () => {
    it('render', () => {
      const node = new ChatView(props)
      node.setState({
        msgViewHeight: jest.fn(),
        isRecording: jest.fn(),
        recordTime: jest.fn(),
        refreshing: jest.fn(),
        recordEls: jest.fn(),
        showVoiceRecorder: jest.fn(),
        biggerImageVisible: jest.fn(),
        heightAnim: jest.fn(),
        isInited: jest.fn(),
        showMore: jest.fn(),
        burnValue: jest.fn(),
        showScrollBottom: jest.fn(),
        showMsg: jest.fn()
      })
      expect(node).toMatchSnapshot()
    })
    it('send', async () => {
      const node = new ChatView(props)
      expect(node.send()).toMatchSnapshot()
    })
    it('componentDidMount', async () => {
      const node = new ChatView(props)
      expect(node.componentDidMount()).toMatchSnapshot()
    })
  })
})
