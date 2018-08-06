import Contact from '../../store/Contact'
class LKContactHandler{
    asyResetContacts(members,friends,userId){
        return Contact.resetContacts(members,friends,userId);
    }

    asyRemoveContacts(ids,userId){
        return Contact.removeContacts(ids,userId);
    }

    asyRebuidMembers(ids,newMembers,userId){
        return Contact.rebuidMembers(ids,newMembers,userId);
    }
}
module.exports = new LKContactHandler();
