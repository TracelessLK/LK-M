import Application from '../LKApplication'
import EventTarget from '../../common/core/EventTarget'
import LKContactHandler from '../logic/handler/LKContactHandler'
import LKMagicCodeHandler from '../logic/handler/LKMagicCodeHandler'
import MagicCodeManager from './MagicCodeManager'
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

    asyResetContacts(newMemberMCode,members,friends,userId){
        let curApp = Application.getCurrentApp();
        return  LKContactHandler.asyResetContacts(members,friends,userId||curApp.getCurrentUser().id).then(function () {
            return LKMagicCodeHandler.asyUpdateMemberMagicCode(newMemberMCode,userId||curApp.getCurrentUser().id);
        }).then( ()=> {
            MagicCodeManager.setMemberMagicCode(newMemberMCode);
            this.fire("contactChanged");
        });
    }

    asyRebuildMembers(newMemberMCode,ids,newMembers){
        let curApp = Application.getCurrentApp();
        LKContactHandler.asyRebuidMembers(ids,newMembers,curApp.getCurrentUser().id).then(function () {
            return LKMagicCodeHandler.asyUpdateMemberMagicCode(newMemberMCode,curApp.getCurrentUser().id);
        }).then(() =>{
            MagicCodeManager.setMemberMagicCode(newMemberMCode);
            this.fire("contactChanged");
        });
    }
}


module.exports = new ContactManager();
