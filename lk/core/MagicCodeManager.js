import EventTarget from '../../common/core/EventTarget'
import LKMagicCodeProvider from '../logic/provider/LKMagicCodeProvider'
import Application from '../LKApplication'

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
            let mc = await LKMagicCodeProvider.asyGetMagicCode(Application.getCurrentApp().getCurrentUser().id);
            if(mc)
                this._orgMCode = mc.orgMCode;
        }
        return this._orgMCode;
    }

    async asyGetMemberMCode(){
        if (!this._memberMCode) {
            let mc = await LKMagicCodeProvider.asyGetMagicCode(Application.getCurrentApp().getCurrentUser().id);
            if(mc)
                this._memberMCode = mc.memberMCode;
        }
        return this._memberMCode;
    }

}


module.exports = new MagicCodeManager();
