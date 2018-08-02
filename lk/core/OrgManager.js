import Application from '../LKApplication'
import EventTarget from '../../common/core/EventTarget'
class OrgManager extends EventTarget{

    start(){

    }

    resetOrgs(newOrgMCode,orgs){
        let curApp = Application.getCurrentApp();
        curApp.getLKOrgHandler().asyResetOrgs(orgs,curApp.getCurrentUser().id).then(function () {
            return curApp.getLKMagicCodeHandler().asyUpdateOrgMagicCode(newOrgMCode,curApp.getCurrentUser().id);
        }).then(function () {
            curApp.setOrgMagicCode(newOrgMCode);
            this.fire("orgChanged");
        });
    }
}


module.exports = new OrgManager();
