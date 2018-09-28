import Application from '../LKApplication'
import EventTarget from '../../common/core/EventTarget'
import MFApply from '../store/MFApply'
import ConfigManager from '../../common/core/ConfigManager'
class MFApplyManager extends EventTarget{

    start(){

    }
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

