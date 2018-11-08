const Org =require('../../store/Org')
class LKOrgHandler{
    asyResetOrgs(orgs,userId){
        return Org.reset(orgs,userId);
    }
}
module.exports = new LKOrgHandler();
