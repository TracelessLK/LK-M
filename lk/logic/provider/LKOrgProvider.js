import Org from '../../store/Org'
class LKOrgProvider{
    asyGetTopMCode(){
        return Org.getTopMCode();
    }
}
module.exports = new LKOrgProvider();
