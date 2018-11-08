
const Contact = require('../../store/Contact')
class LKContactProvider{
    asyGet(userId,contactId){
        return Contact.get(userId,contactId);
    }

    asyGetAll(userId){
        return Contact.getAll(userId);
    }

    asyGetAllMembers(userId){
        return Contact.getAll(userId,0);
    }

    asyGetAllFriends(userId){
        return Contact.getAll(userId,1);
    }

    asyGetMembersByOrg(userId,orgId){
        return Contact.getMembersByOrg(userId,orgId);
    }

    asySelectAllDevices(contactId){
        return Contact.selectAllDevices(contactId);
    }
}
module.exports = new LKContactProvider();

