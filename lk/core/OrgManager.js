import Application from '../LKApplication'
import EventTarget from '../../common/core/EventTarget'
import LKOrgHandler from '../logic/handler/LKOrgHandler'
import LKMagicCodeHandler from '../logic/handler/LKMagicCodeHandler'
import MagicCodeManager from './MagicCodeManager'
import Org from '../store/Org'

class OrgManager extends EventTarget{

    start(){

    }

    asyResetOrgs(newOrgMCode,orgs,userId){
        return LKOrgHandler.asyResetOrgs(orgs,userId).then( () =>{
            return LKMagicCodeHandler.asyUpdateOrgMagicCode(newOrgMCode,userId);
        }).then( ()=>{
            MagicCodeManager.setOrgMagicCode(newOrgMCode);
            this.fire("orgChanged");
        });
    }
    async removeAll(){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        await Org.removeAll(userId);
    }

}


module.exports = new OrgManager();
