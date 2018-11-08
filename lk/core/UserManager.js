const Application = require( '../LKApplication')
const EventTarget = require( '../../common/core/EventTarget')
const LKUserHandler = require( '../logic/handler/LKUserHandler')

class UserManager extends EventTarget{


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
      this.fire("nameChanged");
    }
    async setUserPic(pic){
        await Application.getCurrentApp().getLKWSChannel().setUserPic(pic);
        let user = Application.getCurrentApp().getCurrentUser();
        await LKUserHandler.asySetUserPic(pic,user.id);
        user.pic = pic;
      this.fire("picChanged");
    }

}


module.exports = new UserManager();
