const EventTarget = require('./EventTarget')
const cfg = require('../../app.json')
class Application extends EventTarget{
  constructor (appName) {
    super();
    this._appName = appName||cfg.appName;
    Application._current = this
  }

  setCurrentUser (user,venderId) {
    this._user = user;
    this._venderId = venderId;
  }

  getCurrentUser () {
    return this._user
  }

  getVenderId(){
    return this._venderId;
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
  start(db){
    this._dataSource = db;
    this.fire("dbReady",db);
  }
  getDataSource(){
    return this._dataSource
  }
}
Application.getCurrentApp = function () {
  return this._current
}
Application.PLATFORM_RN = 1;
Application.PLATFORM_ELECTRON = 2;
module.exports = Application
