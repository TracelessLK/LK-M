const MagicCode = require('../../store/MagicCode')
class LKMagicCodeProvider{
    asyGetMagicCode(userId){
        return MagicCode.getMagicCode(userId);
    }
}
module.exports = new LKMagicCodeProvider();
