import Application from '../LKApplication'
import EventTarget from '../../common/core/EventTarget'
import MFApply from '../store/MFApply'
import ConfigManager from '../../common/core/ConfigManager'
class MFApplyManager extends EventTarget{

    start(){

    }
    asyAddNewMFApply(apply){
        return new Promise((resolve,reject)=>{
            MFApply.add(apply,Application.getCurrentApp().getCurrentUser().id).then(()=>{
                this.fire("receiveMFApply");
                resolve();
            });
        });

    }

    asyGetAll() {
        return MFApply.getAll(Application.getCurrentApp().getCurrentUser().id);
    }

    async accept(contactId){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        await MFApply.accept(contactId,userId);
        let friend = await MFApply.get(contactId,userId);
        ConfigManager.getContactManager().asyAddNewFriend(friend);
        return Application.getCurrentApp().getLKWSChannel().acceptMF(contactId,friend.serverIP,friend.serverPort);
    }

}


module.exports = new MFApplyManager();

