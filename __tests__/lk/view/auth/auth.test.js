import React from 'react'
import renderer from 'react-test-renderer'
import AuthStack from '../../../../lk/view/auth/AuthStack'

test('AuthStack test', () => {
  renderer.create(
    <AuthStack />
  )
})
