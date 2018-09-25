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
    async setUserName(name){
        await Application.getCurrentApp().getLKWSChannel().setUserName(name);
        let user = Application.getCurrentApp().getCurrentUser();
        await LKUserHandler.asySetUserName(name,user.id);
        user.name = name;
    }
    async setUserPic(pic){
        await Application.getCurrentApp().getLKWSChannel().setUserPic(pic);
        let user = Application.getCurrentApp().getCurrentUser();
        await LKUserHandler.asySetUserPic(pic,user.id);
        user.pic = pic;
    }

}


module.exports = new UserManager();
