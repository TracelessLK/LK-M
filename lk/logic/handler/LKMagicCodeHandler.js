import MagicCode from '../../store/MagicCode'
class LKMagicCodeHandler{
    asyReset(orgMCode,memberMCode,userId){
        return MagicCode.reset(orgMCode,memberMCode,userId);
    }

    asyUpdateOrgMagicCode(code,userId){
        return MagicCode.updateOrgMagicCode(code,userId);
    }
}
module.exports = new LKMagicCodeHandler();
