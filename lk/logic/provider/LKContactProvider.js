
import Contact from '../../store/Contact'
class LKContactProvider{
    asyGet(contactId){
        return Contact.get(contactId);
    }

    asyLeftSelectAllDevices(contactId){
        return Contact.leftSelectAllDevices(contactId);
    }
}
module.exports = new LKContactProvider();

