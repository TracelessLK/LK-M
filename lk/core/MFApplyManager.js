import Application from '../LKApplication'
import EventTarget from '../../common/core/EventTarget'
import MFApply from '../store/MFApply'
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

    accept(contactId){
        return MFApply.accept(contactId,Application.getCurrentApp().getCurrentUser().id);
    }

}


module.exports = new MFApplyManager();

