const LKUser = require('../../store/LKUser')
class LKUserProvider{
    asyGetAll(){
        return LKUser.getAll();
    }
    asyGet(userId){
        return LKUser.get(userId);
    }

}
module.exports = new LKUserProvider();