import Org from '../../store/Org'
class LKOrgHandler{
    asyResetOrgs(orgs,userId){
        return Org.reset(orgs,userId);
    }
}
module.exports = new LKUserHandler();