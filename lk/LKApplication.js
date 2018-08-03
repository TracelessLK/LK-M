import Application from '../engine/Application'
import ConfigManager from '../common/core/ConfigManager'

class LKApplication extends Application{

    constructor(name){
        super(name);
    }

    setCurrentUser(user){
        super.setCurrentUser(user);
        let url=user?'ws://'+user.serverIP+':'+user.serverPort:null;
        if((!this._channel)||(this._channel.getUrl()!=url)){
            if(this._channel){
                this._channel.close();
                delete this._channel;
            }
            if(url)
                this._channel = new (ConfigManager.getWSChannel())('ws://'+user.serverIP+':'+user.serverPort,true);

        }
        if(this._channel) {
            this._channel.applyChannel().then((channel)=>{
                return channel.asyLogin(user.id,user.password);
            })
        }
    }

    register(user){
        let channel = new (ConfigManager.getWSChannel())('ws://'+option.ip+':'+option.port,true);
        channel.asyRegister(option).then(function () {
            //TODO
        });
    }

    asyUnRegister(){
        const p = this._channel.asyUnRegister()
         const p2 = p.then( ()=> {
            //TODO 删除数据、清除缓存

            this.setCurrentUser(null);

        })
        return p2
    }


    getLKWSChannel(){
        return this._channel;
    }


    setOrgMagicCode(code){
        this._orgMCode = code;
    }

    setMemberMagicCode(code){
        this._memberMCode = code;
    }

    async asyGetOrgMCode(){
        if (!this._orgMCode) {
            this._orgMCode = await this._lkMagicCodeProvider.asyGetMagicCode(this.getCurrentUser().id).orgMCode;
        }
        return this._orgMCode;
    }

    async asyGetMemberMCode(){
        if (!this._memberMCode) {
            this._memberMCode = await this._lkMagicCodeProvider.asyGetMagicCode(this.getCurrentUser().id).memberMCode;
        }
        return this._memberMCode;
    }

    setMessageTimeout(timeout){
        this._messageTimeout = timeout;
    }

    getMessageTimeout(){
        return this._messageTimeout;
    }

}
new LKApplication("LK");
module.exports = LKApplication;
