import React from 'react'
import 'react-native'
import { shallow } from 'enzyme'
// import renderer from 'react-test-renderer'
import RegisterView from '../../../../lk/view/auth/RegisterView'

const path = require('path')

const rootPath = path.resolve(__dirname, '../../../../')
const unversion = require(path.resolve(rootPath, 'config/unversioned'))
const { register } = unversion

describe('RegisterView Test', () => {
  it('RegisterView', () => {
    let wrapper
    wrapper = shallow(<RegisterView />)
    this.props.navigation.navigate(wrapper, {
      register
    })
  })
})
