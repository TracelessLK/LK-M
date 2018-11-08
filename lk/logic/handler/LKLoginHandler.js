const LoginHandler = require( '../../../common/logic/handler/login/LoginHandler')
const Application = require( '../../LKApplication')
const CryptoJS = require( "crypto-js")
class LKLoginHandler extends  LoginHandler{
    needLogin(){
        return false;
    }

   async asyLogin(userId,password,pwdHash){
       let result = await Promise.all([Application.getCurrentApp().getLKUserProvider().asyGet(userId),pwdHash]);
       let user = result[0] ;
       let hc =  result[1] ;
       if(hc==user.password){
           var bytes  = CryptoJS.AES.decrypt(user.privateKey, password);
           user.privateKey = bytes.toString(CryptoJS.enc.Utf8);
           Application.getCurrentApp().setCurrentUser(user);
       }
       return userId;
    }

    getLogin(){
        return true
    }

}

module.exports = new LKLoginHandler()
