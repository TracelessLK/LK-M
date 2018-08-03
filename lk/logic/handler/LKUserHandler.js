import LKUser from '../../store/LKUser'
class LKUserHandler{
    asyAddLKUser(lkUser){
        return LKUser.add(lkUser);
    }
    asyRemoveLKUser(uid){
        return LKUser.remove(uid);
    }
}
module.exports = new LKUserHandler();