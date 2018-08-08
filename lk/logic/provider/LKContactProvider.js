
import Contact from '../../store/Contact'
class LKContactProvider{
    asyGet(contactId){
        return Contact.get(contactId);
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

    asySelectAllDevices(contactId){
        return Contact.selectAllDevices(contactId);
    }
}
module.exports = new LKContactProvider();

