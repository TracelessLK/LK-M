import MagicCode from '../../store/MagicCode'
class LKMagicCodeProvider{
    asyGetMagicCode(userId){
        return MagicCode.getMagicCode(userId);
    }
}
module.exports = new LKMagicCodeProvider();
