import Application from '../LKApplication'
import EventTarget from '../../common/core/EventTarget'
import LKContactHandler from '../logic/handler/LKContactHandler'
import LKMagicCodeHandler from '../logic/handler/LKMagicCodeHandler'
import MagicCodeManager from './MagicCodeManager'
class ContactManager extends EventTarget{

    start(){

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

    //TODO 如果基本信息变化的member包括自己，更新LKUser表以及缓存

    asyRebuildMembers(newMemberMCode,ids,newMembers){
        let curApp = Application.getCurrentApp();
        LKContactHandler.asyRebuidMembers(ids,newMembers,curApp.getCurrentUser().id).then(function () {
            return LKMagicCodeHandler.asyUpdateMemberMagicCode(newMemberMCode,curApp.getCurrentUser().id);
        }).then(() =>{
            MagicCodeManager.setMemberMagicCode(newMemberMCode);
            this.fire("contactChanged");
        });
    }

    async asyAddNewFriend(friend){
        await LKContactHandler.asyAddNewFriend(friend,Application.getCurrentApp().getCurrentUser().id);
        this.fire("contactChanged");
    }
}


module.exports = new ContactManager();
