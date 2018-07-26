import Org from '../../store/Org'
class LKOrgProvider{
    asyGetTopOrg(userId){
        return Org.getTopOrg(userId);
    }
}
module.exports = new LKOrgProvider();
