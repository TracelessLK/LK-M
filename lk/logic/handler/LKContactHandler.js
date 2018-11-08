const Contact = require('../../store/Contact')
class LKContactHandler{
    asyResetContacts(members,friends,groupContacts,userId){
        return Contact.resetContacts(members,friends,groupContacts,userId);
    }

    asyRemoveContacts(ids,userId){
        return Contact.removeContacts(ids,userId);
    }

    asyRebuidMembers(ids,newMembers,userId){
        return Contact.rebuidMembers(ids,newMembers,userId);
    }

    asyAddNewFriend(friend,userId){
        return Contact.addNewFriends([friend],userId);
    }
}
module.exports = new LKContactHandler();
