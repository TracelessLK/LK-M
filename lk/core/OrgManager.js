const Application = require( '../LKApplication')
const EventTarget = require( '../../common/core/EventTarget')
const LKOrgHandler = require( '../logic/handler/LKOrgHandler')
const LKMagicCodeHandler = require( '../logic/handler/LKMagicCodeHandler')
const MagicCodeManager = require( './MagicCodeManager')
const Org = require( '../store/Org')

class OrgManager extends EventTarget{


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
