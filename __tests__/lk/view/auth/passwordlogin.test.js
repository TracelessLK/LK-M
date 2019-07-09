import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import PasswordLoginView from '../../../../lk/view/auth/PasswordLoginView'

describe('PasswordLogin', () => {
  function login(props) {
    const tree = renderer.create(<PasswordLoginView {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  }

  it('params login', () => {
    let props = {
      navigation: {state: {params: {user: {name: 'test_01', password: 'hfs'}, t: 'hfs'}}}
    }
    login(props)
  })
})
