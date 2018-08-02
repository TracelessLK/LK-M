class Application{

    static _current=null;

    constructor(appName){
        this._appName = appName;
        Application._current = this;
    }

    static getCurrentApp(){
        return this._current;
    }

    setCurrentUser(user){
        this._user = user;
    }

    getCurrentUser(){
        return this._user;
    }

    setLoginHandler(h){
        this._loginHandler = h;
    }

    getLoginHandler () {
        return this._loginHandler;
    }

}
module.exports = Application;