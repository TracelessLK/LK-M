import Application from '../LKApplication'
import EventTarget from '../../common/core/EventTarget'
import LKOrgHandler from '../logic/handler/LKOrgHandler'
import LKMagicCodeHandler from '../logic/handler/LKMagicCodeHandler'

class OrgManager extends EventTarget{

    start(){

    }

    asyResetOrgs(newOrgMCode,orgs){
        let curApp = Application.getCurrentApp();
        LKOrgHandler.asyResetOrgs(orgs,curApp.getCurrentUser().id).then(function () {
            return LKMagicCodeHandler.asyUpdateOrgMagicCode(newOrgMCode,curApp.getCurrentUser().id);
        }).then(function () {
            curApp.setOrgMagicCode(newOrgMCode);
            this.fire("orgChanged");
        });
    }

}


module.exports = new OrgManager();
