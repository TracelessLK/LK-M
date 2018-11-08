const Application = require( '../LKApplication')
const EventTarget = require( '../../common/core/EventTarget')
const LKContactHandler = require( '../logic/handler/LKContactHandler')
const LKMagicCodeHandler = require( '../logic/handler/LKMagicCodeHandler')
const MagicCodeManager = require( './MagicCodeManager')
const Contact = require( '../store/Contact')
const Device = require( '../store/Device')
const ConfigManager = require( '../../common/core/ConfigManager')
class ContactManager extends EventTarget{


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
        if(ids&&ids.length>0&&newMembers&&newMembers.length>0){
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
        let curContact = await Contact.get(userId,friend.id);
        if(!curContact)
            await LKContactHandler.asyAddNewFriend(friend,userId);
        else if(curContact.relation==2){
            await Contact.updateGroupContact2Friend(friend.id,userId);
        }
        this.fire("contactChanged");
    }
    async removeAll(){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        await Contact.removeAll(userId);
        await Device.removeAll(userId);
    }
}


module.exports = new ContactManager();
