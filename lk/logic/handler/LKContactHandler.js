import Contact from '../../store/Contact'
class LKContactHandler{
    asyRestContacts(members,friends,userId){
        return Contact.reset(members,friends,userId);
    }
}
module.exports = new LKUserHandler();