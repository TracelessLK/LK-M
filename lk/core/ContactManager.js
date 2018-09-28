import Application from '../LKApplication'
import EventTarget from '../../common/core/EventTarget'
import LKContactHandler from '../logic/handler/LKContactHandler'
import LKMagicCodeHandler from '../logic/handler/LKMagicCodeHandler'
import MagicCodeManager from './MagicCodeManager'
import Contact from '../store/Contact'
import ConfigManager from '../../common/core/ConfigManager'
class ContactManager extends EventTarget{

    start(){

    }
    asyResetContacts(newMemberMCode,members,friends,groupContacts,userId){
        let curApp = Application.getCurrentApp();
        return  LKContactHandler.asyResetContacts(members,friends,groupContacts,userId||curApp.getCurrentUser().id).then(function () {
            return LKMagicCodeHandler.asyUpdateMemberMagicCode(newMemberMCode,userId||curApp.getCurrentUser().id);
        }).then( ()=> {
            MagicCodeManager.setMemberMagicCode(newMemberMCode);
            this.fire("contactChanged");
        });
    }

    asyRebuildMembers(newMemberMCode,ids,newMembers){
        let curApp = Application.getCurrentApp();
        if(ids&&ids.length>0){
            let userId = curApp.getCurrentUser().id;
            for(let i=0;i<newMembers.length;i++){
                let m = newMembers[i];
                if(m.id===userId){
                    ConfigManager.getUserManager().setUserName(m.name);
                    ConfigManager.getUserManager().setUserPic(m.pic);
                    break;
                }
            }
            LKContactHandler.asyRebuidMembers(ids,newMembers,curApp.getCurrentUser().id).then(function () {
                return LKMagicCodeHandler.asyUpdateMemberMagicCode(newMemberMCode,curApp.getCurrentUser().id);
            }).then(() =>{
                MagicCodeManager.setMemberMagicCode(newMemberMCode);
                this.fire("contactChanged");
            });
        }

    }

    async asyAddNewFriend(friend){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        let curContact = Contact.get(userId,friend.id);
        if(!curContact)
            await LKContactHandler.asyAddNewFriend(friend,userId);
        else if(curContact.relation==2){
            await Contact.updateGroupContact2Friend(friend.id,userId);
        }
        this.fire("contactChanged");
    }
}


module.exports = new ContactManager();
