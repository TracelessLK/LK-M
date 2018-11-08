const Application = require( '../LKApplication')
const EventTarget = require( '../../common/core/EventTarget')
const MFApply = require( '../store/MFApply')
const ConfigManager = require( '../../common/core/ConfigManager')
class MFApplyManager extends EventTarget{

    asyAddNewMFApply(apply){
        return new Promise((resolve,reject)=>{
            let userId = Application.getCurrentApp().getCurrentUser().id;
            MFApply.get(apply.id,userId).then((app)=>{
                if(!app){
                    MFApply.add(apply,userId).then(()=>{
                        this.fire("receiveMFApply");
                        resolve();
                    });
                }else{
                    resolve();
                }
            })

        });

    }

    asyGetAll() {
        return MFApply.getAll(Application.getCurrentApp().getCurrentUser().id);
    }

    async accept(contactId){
        return new Promise((resolve,reject)=>{
            let userId = Application.getCurrentApp().getCurrentUser().id;
            
            MFApply.accept(contactId,userId).then(()=>{
                MFApply.get(contactId,userId).then((friend)=>{
                    Application.getCurrentApp().getLKWSChannel().acceptMF(contactId,friend.name,friend.pic,friend.serverIP,friend.serverPort,friend.mCode).then(()=>{
                        ConfigManager.getContactManager().asyAddNewFriend(friend).then(()=>{
                            resolve();
                        });
                    });
                });
            });
        });

    }

    async removeAll(){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        await MFApply.removeAll(userId);
    }

}


module.exports = new MFApplyManager();

