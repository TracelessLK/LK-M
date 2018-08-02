import Contact from '../../store/Contact'
class LKContactHandler{
    asyRestContacts(members,friends,userId){
        return Contact.reset(members,friends,userId);
    }

    asyRemoveContacts(ids,userId){
        return Contact.removeContacts(ids,userId);
    }
}
module.exports = new LKContactHandler();
