import LogcalLoginHandler from "./logic/handler/login/LocalLoginHandler"
const AppTemplate = {
    getLoginHandler:function () {
        if(!this.loginHandler){
            return new LogcalLoginHandler();
        }
        return this.loginHandler;
    }
}
module.exports = AppTemplate;
