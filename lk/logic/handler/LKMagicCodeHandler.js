const MagicCode = require('../../store/MagicCode')
class LKMagicCodeHandler{
    asyReset(orgMCode,memberMCode,userId){
        return MagicCode.reset(orgMCode,memberMCode,userId);
    }

    asyUpdateOrgMagicCode(code,userId){
        return MagicCode.updateOrgMagicCode(code,userId);
    }

    asyUpdateMemberMagicCode(code,userId){
        return MagicCode.updateMemberMagicCode(code,userId);
    }
}
module.exports = new LKMagicCodeHandler();
