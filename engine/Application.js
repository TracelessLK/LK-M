import LogcalLoginHandler from "../common/logic/handler/login/LocalLoginHandler"
class Application{

    static _current=null;

    constructor(appName){
        this._appName = appName;
        Application._current = this;
    }

    static getCurrentApp(){
        return this._current;
    }

    start(){
    }



    getLoginHandler () {
        if(!this.loginHandler){
            return new LogcalLoginHandler();
        }
        return this.loginHandler;
    }
}
module.exports = Application;