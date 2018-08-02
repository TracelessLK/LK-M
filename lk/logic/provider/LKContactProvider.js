
import Contact from '../../store/Contact'
class LKContactProvider{
    asyGet(contactId){
        return Contact.get(contactId);
    }

    asyGetAll(userId){
        return Contact.getAll(userId);
    }

    asySelectAllDevices(contactId){
        return Contact.selectAllDevices(contactId);
    }
}
module.exports = new LKContactProvider();

