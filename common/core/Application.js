const EventTarget = require('./EventTarget')
const ConfigManager = require('./ConfigManager')
const cfg = require('../../app.json')
class Application extends EventTarget{
  constructor (appName) {
    super();
    this._appName = appName||cfg.appName;
    Application._current = this
  }

  setCurrentUser (user) {
    this._user = user
  }

  getCurrentUser () {
    return this._user
  }

  setLoginHandler (h) {
    this._loginHandler = h
  }

  getLoginHandler () {
    return this._loginHandler
  }

  getPlatform(){
    if(!this._platform){
      this._platform = cfg.platform=="reactnative"?Application.PLATFORM_RN:Application.PLATFORM_ELECTRON
    }
    return this._platform
  }

  getName(){
    return this._appName;
  }
  getDataSource(){
    return ConfigManager.getDataSource()
  }
}
Application.getCurrentApp = function () {
  return this._current
}
Application.PLATFORM_RN = 1;
Application.PLATFORM_ELECTRON = 2;
module.exports = Application
