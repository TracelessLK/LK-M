const LKUser = require('../../store/LKUser')
class LKUserHandler{
    asyAddLKUser(lkUser){
        return LKUser.add(lkUser);
    }
    asyRemoveLKUser(uid){
        return LKUser.remove(uid);
    }
    asySetUserName(name,id){
        return LKUser.setUserName(name,id);
    }
    asySetUserPic(pic,id){
        return LKUser.setUserPic(pic,id);
    }
}
module.exports = new LKUserHandler();