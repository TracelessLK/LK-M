import { NetworkInfo } from 'react-native-network-info'

class NetUtil {
  static getLocalAddress() {
    NetworkInfo.getIPAddress(ip => {
      console.log({ip})
    })
  }
}

Object.freeze(NetUtil)
module.exports = NetUtil
