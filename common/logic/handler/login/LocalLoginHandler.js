import User from "../../../store/User"
import Login from "../../bean/Login"
const LoginHandler = require("./LoginHandler")
class LocalLoginHandler extends LoginHandler{
    needLogin(){
        return true;
    }
    userExits(){
       return User.userExits();
    }
    getLogin(){
        return this.login;
    }
    login(id,name,pass,callback){
        //TODO check pass md5
        this.login = new Login(id,name);
        callback(this.login);
    }
}
module.exports = LocalLoginHandler;
