import UUID from 'uuid/v4';
import WSChannel from '../../common/net/WSChannel'
import Application from '../LKApplication'
import CryptoJS from "crypto-js";

class LKChannel extends WSChannel{

    _callbacks={}
    _timeout=60000

    constructor(url){
        super(url,true);
        this._ping();
    }

    _onmessage = (message)=>{
        let msg = JSON.parse(message.data);
        let header = msg.header;
        let isResponse = header.response;
        if(isResponse){
            let msgId = header.msgId;
            let callback = this._callbacks[msgId];
            if(callback){
                callback(msg);
            }
        }
    }

    _onreconnect(){
        if(Application.getCurrentApp().getCurrentUser())
            this.asyLogin();
    }

    _generateMsgId () {
        return UUID();
    }

    async _asyNewRequest (action,content,targets,chatId,lastChatMsg,preSentChatMsg) {
        let id = this._generateMsgId();
        let _content = null;
        let _targets = null;
        let uid = null;
        let did = null;
        if(Application.getCurrentApp().getCurrentUser()){
            uid = Application.getCurrentApp().getCurrentUser().id;
            did = Application.getCurrentApp().getCurrentUser().deviceId;

            if(chatId){
                let ps = [];
                ps.push(Application.getCurrentApp().getChatManager().asyGetChat(chatId));
                ps.push(Application.getCurrentApp().getChatManager().asyGetChatMembers(chatId,true));
                _content = CryptoJS.AES.encrypt(content, result[0].key).toString();
                _targets = result[1];
            }
        }
        _content = _content?_content:content;
        _targets = _targets?_targets:targets;

        //let mCode = Application.getCurrentApp().getCurrentUser().mCode;

        return  {
            header:{
                version:"1.0",
                id:id,
                action:action,
                uid:uid,
                did:did,
                chatId:chatId,
                lastChatMsg:lastChatMsg,
                preSentChatMsg:preSentChatMsg,
                targets:_targets,
                time:Date.now(),

                timeout:Application.getCurrentApp().getMessageTimeout()

            },
            body:{
                content:_content
            }
        };
    }

    _sendMessage(req){
        return new Promise((resolve,reject)=>{
            let msgId = req.header.id;
            this._callbacks[msgId] = (msg)=>{
                delete this._callbacks[msgId];
                resolve(msg);
            }
            try{
                super.send(JSON.stringify(req));
            }catch (e){
                reject({error:e.toString()});
            }

            setTimeout(()=>{
                if(this._callbacks[msgId]){
                    reject({error:"timeout"});
                }

            },this._timeout);
        });

    }

   async  _checkMembersDiff(serverMembers){
       let curApp = Application.getCurrentApp();
       let added = [];
       let modified = [];
       let removed = [];
       let remoteMembers = new Map();
       serverMembers.forEach(function (m) {
           remoteMembers.set(m.id,m);
       });
       let localMembers = await curApp.getLKContactProvider().asyGetAll(curApp.getCurrentUser().id);
       localMembers.forEach((lm)=>{
           let curMCode = lm.mCode;
           let curId = lm.id;
           let remoteM = remoteMembers.get(lm.id);
           if(remoteM){
               if(remoteM.mCode!=lm.mCode){
                   modified.push(lm.id);
               }
               remoteMembers.delete(lm.id);
           }else{
               removed.push(lm.id);
           }
       });
       remoteMembers.forEach(function (v,k) {
           added.push(k);
       });
       return {added:added,modified:modified,removed:removed};
    }

   async _ping(){
        let deprecated = false;
        if(!this._lastPongTime){
            this._lastPongTime = Date.now();
        }else if(this._openPromise&&!this._foreClosed&&Date.now()-this._lastPongTime>180000){
            try{
                this._ws.close();
            }catch (e){

            }
            delete this._openPromise;
            deprecated=true;
        }
        if(!deprecated&&!this._foreClosed){
            try{
                let curApp = Application.getCurrentApp();
                let result = await Promise.all([curApp.asyGetOrgMCode(),curApp.asyGetMemberMCode()]);
                let orgMCode = result[0];
                let memberMCode = result[1];
                result = await Promise.all([this.applyChannel(),this._asyNewRequest("ping",{orgMCode:orgMCode,memberMCode:memberMCode})]);
                result[0]._sendMessage(result[1]).then((msg)=>{
                    let content = msg.body.content;
                    this._lastPongTime = Date.now();
                    if(orgMCode!= content.orgMCode){
                        let orgs = content.orgs;
                        if(orgs){
                            curApp.getOrgManager().resetOrgs(content.orgMCode,orgs);
                        }
                    }
                    if(memberMCode!=content.memberMCode){
                        let members = content.members;
                        if(members) {
                            this._checkMembersDiff(members).then((diff)=>{
                                curApp.getLKContactHandler().asyRemoveContacts(diff.removed,curApp.getCurrentUser().id);
                                //TODO added modified
                            });
                        }

                    }
                });
            }catch (e){

            }

        }
        setTimeout(()=>{this._ping()},60000);
    }

    async asyLogin(){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("login")]);
        return result[0]._sendMessage(result[1]);
    }

   async asyRegister(ip,port,uid,did,venderDid,pk,checkCode,qrCode,description){
       let msg = {uid:uid,did:did,venderDid:venderDid,pk:pk,checkCode:checkCode,qrCode:qrCode,description:description};

       let result = await Promise.all([this.applyChannel(),this._asyNewRequest("register",msg)]);

       return new Promise((resolve,reject)=>{
            result[0]._sendMessage(result[1]).then((msg)=>{
                let content = msg.body.content;
                if(content.error){
                    reject(content.error);
                }else{
                    let orgs = content.orgs;
                    let members = content.members;
                    let friends = content.friends;
                    Application.getCurrentApp().initOrgContacts(orgs,members,friends);
                    resolve();
                }
            }).catch((error)=>{
                reject(error);
            });
        });
    }
}

module.exports=LKChannel;
