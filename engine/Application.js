class Application {
  constructor (appName) {
    this._appName = appName
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
}
Application.getCurrentApp = function () {
  return this._current
}
module.exports = Application
