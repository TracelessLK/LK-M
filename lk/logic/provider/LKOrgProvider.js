const Org = require('../../store/Org')
class LKOrgProvider{
    asyGetChildren(parentId,userId){
        return Org.getChildren(parentId,userId)
    }
}
module.exports = new LKOrgProvider();
