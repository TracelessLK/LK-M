import LoginHandler from '../../../common/logic/handler/login/LoginHandler'
import Application from '../../LKApplication'
import CryptoJS from "crypto-js";
import RNFS from 'react-native-fs';
class LKLoginHandler extends  LoginHandler{
    needLogin(){
        return true;
    }

   async asyLogin(userId,password){
       let result = await Promise.all([Application.getCurrentApp().getLKUserProvider().asyGet(userId),RNFS.hash(password,'md5')]);
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
