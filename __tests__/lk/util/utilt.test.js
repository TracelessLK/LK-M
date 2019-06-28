//mock整个模块
jest.mock('../../../lk/util/NetUtil.js')

test('net ip', () => {
  const NetUtil = require('../../../lk/util/NetUtil')
  const ip = NetUtil.getLocalAddress()
  console.log(ip)
  expect(ip).toBe(undefined)
})
