import Application from '../engine/Application'
import ConfigManager from '../common/core/ConfigManager'
import RSAKey from "react-native-rsa";

class LKApplication extends Application{

    constructor(name){
        super(name);
    }

    setCurrentUser(user){
        super.setCurrentUser(user);

        if(user){
            let rsa = new RSAKey();
            rsa.setPrivateString(user.privateKey);
            this._rsa = rsa;
        }else{
            delete this._rsa;
        }

        let url=user?'ws://'+user.serverIP+':'+user.serverPort:null;
        if((!this._channel)||(this._channel.getUrl()!==url)){
            if(this._channel){
                this._channel.close();
                delete this._channel;
            }
            if(url){
                this._channel = new (ConfigManager.getWSChannel())('ws://'+user.serverIP+':'+user.serverPort,true);
            }
        }
        if(this._channel) {
            this._channel.applyChannel().then((channel)=>{
                return channel.asyLogin(user.id,user.password);
            })
        }
        //TODO notify all managers to reset
    }

    getCurrentRSA(){
        return this._rsa;
    }

    async asyRegister(user,venderDid,checkCode,qrcode,description){
        let channel = new (ConfigManager.getWSChannel())('ws://'+user.serverIP+':'+user.serverPort,true);
        return new Promise((resolve,reject)=>{
            channel.asyRegister(user.serverIP,user.serverPort,user.id,user.deviceId,venderDid,user.publicKey,checkCode,qrcode,description).then(function (msg) {
                let content = msg.body.content;
                if(content.error){
                    reject(content.error);
                }else{
                    let serverPK = content.publicKey;
                    let orgMCode = content.orgMCode;
                    let orgs = content.orgs;
                    let memberMCode = content.memberMCode;
                    let members = content.members;
                    let friends = content.friends;
                    ConfigManager.getMagicCodeManager().asyReset(orgMCode,memberMCode,user.id).then(function () {
                        return ConfigManager.getOrgManager().asyResetOrgs(orgMCode,orgs,user.id);
                    }).then(function () {
                        return ConfigManager.getContactManager().asyResetContacts(memberMCode,members,friends,user.id);
                    }).then(function () {
                        user.serverPublicKey = serverPK;
                        return ConfigManager.getUserManager().asyAddLKUser(user);
                    }).then(function () {
                        resolve(user);
                    });
                }


            });
        })

    }

    asyUnRegister(){
        const p = this._channel.asyUnRegister()
         const p2 = p.then( ()=> {
            //TODO 删除数据、清除缓存
             ConfigManager.getUserManager().asyRemoveLKUser(this.getCurrentUser().id);
            this.setCurrentUser(null);

        })
        return p2
    }


    getLKWSChannel(){
        return this._channel;
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
