import Contact from '../../store/Contact'
class LKContactHandler{
    asyRestContacts(members,friends,userId){
        return Contact.reset(members,friends,userId);
    }

    asyRemoveContacts(ids,userId){
        return Contact.removeContacts(ids,userId);
    }

    asyRebuidMembers(ids,newMembers,userId){
        return Contact.rebuidMembers(ids,newMembers,userId);
    }
}
module.exports = new LKContactHandler();
