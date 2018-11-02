import Application from '../engine/Application'
import ConfigManager from '../common/core/ConfigManager'
import RSAKey from 'react-native-rsa'
import {
  AsyncStorage,
  Platform
} from 'react-native'
// import {
//   Toast
// } from 'native-base'
const container = require('./state')
const config = require('./config')
const {appId, appName} = config
const packageJson = require('../package')
const {version: versionLocal} = packageJson
const {UpdateUtil} = require('@ys/react-native-collection')
const {appInfoUrl} = config

class LKApplication extends Application {
  // constructor (name) {
  //   super(name)
  // }

  setCurrentUser (user) {
    super.setCurrentUser(user)
    if (user) {
      // console.log({user})
      this.checkUpdate(user)
      container.state.user = user
      AsyncStorage.setItem('user', JSON.stringify(user))
      let rsa = new RSAKey()
      rsa.setPrivateString(user.privateKey)
      this._rsa = rsa
    } else {
      AsyncStorage.removeItem('user')
      container.state = {}
      delete this._rsa
    }

    let url = user ? 'ws://' + user.serverIP + ':' + user.serverPort : null
    if ((!this._channel) || (this._channel.getUrl() !== url)) {
      if (this._channel) {
        this._channel.close()
        delete this._channel
      }
      if (url) {
        this._channel = new (ConfigManager.getWSChannel())('ws://' + user.serverIP + ':' + user.serverPort, true)
        this._channel.on('connectionFail', () => {
          container.connectionOK = false
        })
        this._channel.on('connectionOpen', () => {
          container.connectionOK = true
        })
      }
    }
    if (this._channel) {
      this._channel.applyChannel().then((channel) => {
        return channel.asyLogin(user.id, user.password)
      })
    }
    ConfigManager.getChatManager().init(user)
    ConfigManager.getMagicCodeManager().init(user)
  }

  getLogin () {
    return this._login
  }
  setLogin (user) {
    this._login = user
  }

  getCurrentRSA () {
    return this._rsa
  }

  async checkUpdate (user) {
    if (container.NetInfoUtil.online) {
      const {serverIP, id, name} = user
      const response = await fetch(appInfoUrl)
      const appInfo = await response.json()
      const {updateUrl, httpProtocol, port} = appInfo
      let base = `${httpProtocol}://${serverIP}:${port}`
      const updateUrlBase = await AsyncStorage.getItem('updateUrlBase')
      if (updateUrlBase) {
        base = updateUrlBase
      }

      // console.log({appInfo})
      const checkUpdateUrl = `${base}${updateUrl}`
      console.log({checkUpdateUrl})
      const manualDownloadUrl = `${base}/pkg/${Platform.OS}/${appName}.${Platform.OS === 'android' ? 'apk' : 'ipa'}`

      const option = {
        checkUpdateUrl,
        versionLocal,
        manualDownloadUrl,
        appId
      }
      const updateUtil = new UpdateUtil(option)
      container.updateUtil = updateUtil
      const optionCheck = {
        customInfo: {
          id,
          name
        },
        versionLocal,
        checkUpdateErrorCb: (error) => {
          console.log(error)
        }
      }
      updateUtil.checkUpdate(optionCheck)
    }
  }

  asyRegister (user, venderDid, checkCode, qrcode, description) {
    let channel = new (ConfigManager.getWSChannel())('ws://' + user.serverIP + ':' + user.serverPort, true)
    return new Promise((resolve, reject) => {
      channel.asyRegister(user.serverIP, user.serverPort, user.id, user.deviceId, venderDid, user.publicKey, checkCode, qrcode, description).then(function (msg) {
        let content = msg.body.content
        if (content.error) {
          reject(content.error)
        } else {
          // console.log({content})
          let serverPK = content.publicKey
          let orgMCode = content.orgMCode
          let orgs = content.orgs
          let memberMCode = content.memberMCode
          let members = content.members
          let friends = content.friends
          let groupContacts = content.groupContacts
          let groups = content.groups
          ConfigManager.getMagicCodeManager().asyReset(orgMCode, memberMCode, user.id).then(function () {
            return ConfigManager.getOrgManager().asyResetOrgs(orgMCode, orgs, user.id)
          }).then(function () {
            return ConfigManager.getContactManager().asyResetContacts(memberMCode, members, friends, groupContacts, user.id)
          }).then(function () {
            return ConfigManager.getChatManager().asyResetGroups(groups, user.id)
          }).then(function () {
            user.serverPublicKey = serverPK
            return ConfigManager.getUserManager().asyAddLKUser(user)
          }).then(function () {
            resolve(user)
          }).catch(err => {
            reject(err)
          })
        }
      })
    })
  }

  async asyUnRegister () {
    await this._channel.asyUnRegister()
    let userId = this.getCurrentUser().id
    await ConfigManager.getChatManager().removeAll(userId)
    await ConfigManager.getContactManager().removeAll(userId)
    await ConfigManager.getMagicCodeManager().removeAll(userId)
    await ConfigManager.getMFApplyManager().removeAll(userId)
    await ConfigManager.getOrgManager().removeAll(userId)
    await ConfigManager.getUserManager().asyRemoveLKUser(userId)
    this.setCurrentUser(null)
  }

  getLKWSChannel () {
    return this._channel
  }

  setMessageTimeout (timeout) {
    this._messageTimeout = timeout
  }

  getMessageTimeout () {
    return this._messageTimeout
  }
}
new LKApplication('LK')
module.exports = LKApplication
