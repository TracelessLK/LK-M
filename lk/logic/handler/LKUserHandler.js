import LKUser from '../../store/LKUser'
class LKUserHandler{
    asyAddLKUser(lkUser){
        return LKUser.add(lkUser);
    }
}
module.exports = new LKUserHandler();