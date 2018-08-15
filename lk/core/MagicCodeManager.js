import EventTarget from '../../common/core/EventTarget'
import LKMagicCodeProvider from '../logic/provider/LKMagicCodeProvider'

class MagicCodeManager extends EventTarget{

    start(){

    }

    setOrgMagicCode(code){
        this._orgMCode = code;
    }

    setMemberMagicCode(code){
        this._memberMCode = code;
    }

    async asyGetOrgMCode(){
        if (!this._orgMCode) {
            this._orgMCode = await LKMagicCodeProvider.asyGetMagicCode(this.getCurrentUser().id).orgMCode;
        }
        return this._orgMCode;
    }

    async asyGetMemberMCode(){
        if (!this._memberMCode) {
            this._memberMCode = await LKMagicCodeProvider.asyGetMagicCode(this.getCurrentUser().id).memberMCode;
        }
        return this._memberMCode;
    }

}


module.exports = new MagicCodeManager();
