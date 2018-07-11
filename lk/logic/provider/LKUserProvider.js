import LKUser from '../../store/LKUser'
class LKUserProvider{
    getAll(){
        return LKUser.getAll();
    }

}
module.exports = LKUserProvider;