import React from "react"
import renderer from 'react-test-renderer'
import SelectUserView from "../../../../lk/view/auth/SelectUserView"

jest.mock('react-native-fs', () => 'RNFS')

describe('SelectUserView Test', () => {
  let props = {
    navigation: {navigate: jest.fn()},
    state: {contentAry: jest.fn()}
  }
  test('readerer create', () => {
    const tree = renderer.create(<SelectUserView {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
  test('delete row', async (done) => {
    const node = new SelectUserView()
    let userid = jest.fn()
    await expect(node.deleteRow(userid)).toMatchSnapshot()
    done()
  })
})
