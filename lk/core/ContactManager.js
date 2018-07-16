import Application from '../LKApplication'
import EventTarget from '../../common/core/EventTarget'
class ContactManager extends EventTarget{

    start(){

    }

    notifyContactMCodeChanged(detail){
        //TODO change database
        this.fire("mCodeChanged",detail);
    }

    notifyContactDeviceAdded(detail){
        //TODO
        this.fire("deviceAdded",detail);
    }

    notifyContactDeviceRemoved(detail){
        //TODO
        this.fire("deviceRemoved",detail);
    }
}
