import Application from '../LKApplication'
import EventTarget from '../../common/core/EventTarget'
import LKUserHandler from '../logic/handler/LKUserHandler'

class UserManager extends EventTarget{

    start(){

    }

    asyAddLKUser(user){
       return LKUserHandler.asyAddLKUser(user);
    }
    asyRemoveLKUser(uid){
        return LKUserHandler.asyRemoveLKUser(uid);
    }

}


module.exports = new UserManager();
