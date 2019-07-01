import React from 'react'
import 'react-native'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import PasswordLoginView from '../../../../lk/view/auth/PasswordLoginView'

jest.mock('../../../../lk/view/auth/PasswordLoginView')

describe('passwordloginview test', () => {
  let component
  let textInput
  const defaultState = {text: ''}

  test('renders correctl', () => {
    const password = renderer.create(<PasswordLoginView />).toJSON()
    expect(password).toMatchSnapshot()
  })

  beforeEach(() => {
    component = shallow(<PasswordLoginView />)
    textInput = component.find('TextInput')
  })

  it('has default state', () => {
    expect(component.state()).toEqual(defaultState)
  })

  it('renders welcome text', () => {
    const expectedText = '请输入登录密码'
    const text = component.find('Text').children().text()
    expect(text).toEqual(expectedText)
  })

  it('password is null', () => {
    expect(component.login()).toEqual(defaultState)
  })

  it('renders input field with placeholder', () => {
    const expectedPlaceholder = 'write something'
    expect(textInput.length).toBe(0)
    expect(textInput.props().placeholder).toEqual(expectedPlaceholder)
  })

  describe('when text changes', () => {
    const newTextValue = 'random string'
    beforeEach(() => {
      textInput.simulate('changeText', newTextValue)
    })

    it('updates component state', () => {
      expect(component.state().text).toEqual(newTextValue)
    })
  })
})
