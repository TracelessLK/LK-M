import UUID from 'uuid/v4';
import WSChannel from '../../common/net/WSChannel'
import Application from '../LKApplication'
import ChatManager from '../core/ChatManager'
import OrgManager from '../core/OrgManager'
import ContactManager from "../core/ChatManager"
import LKContactProvider from '../logic/provider/LKContactProvider'
import LKContactHandler from '../logic/handler/LKContactHandler'
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
                ps.push(ChatManager.asyGetChat(chatId));
                ps.push(ChatManager.asyGetChatMembers(chatId,true));
                let result = await Promise.all(ps);
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
       let localMembers = await LKContactProvider.asyGetAll(curApp.getCurrentUser().id);
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
       if(this._foreClosed){
           return;
       }
        let deprecated = false;
        if(!this._lastPongTime){
            this._lastPongTime = Date.now();
        }else if(this._openPromise&&Date.now()-this._lastPongTime>180000){
            try{
                this._ws.close();
            }catch (e){

            }
            delete this._openPromise;
            deprecated=true;
        }
        if(!deprecated){
            try{
                let curApp = Application.getCurrentApp();
                let result;
                let orgMCode;
                let memberMCode ;
                let checkMCode = false;
                if(curApp.getCurrentUser()){
                    result = await Promise.all([curApp.asyGetOrgMCode(),curApp.asyGetMemberMCode()]);
                    orgMCode = result[0];
                    memberMCode = result[1];
                    result = await Promise.all([this.applyChannel(),this._asyNewRequest("ping",{orgMCode:orgMCode,memberMCode:memberMCode})]);
                    checkMCode = true;
                }else{
                    result = await Promise.all([this.applyChannel(),this._asyNewRequest("ping")]);
                }

                result[0]._sendMessage(result[1]).then((msg)=>{
                    this._lastPongTime = Date.now();
                    if(checkMCode){
                        let content = msg.body.content;
                        if(orgMCode!= content.orgMCode){
                            let orgs = content.orgs;
                            if(orgs){
                                OrgManager.asyResetOrgs(content.orgMCode,orgs,curApp.getCurrentUser().id);
                            }
                        }
                        if(memberMCode!=content.memberMCode){
                            let members = content.members;
                            if(members) {
                                this._checkMembersDiff(members).then((diff)=>{
                                    LKContactHandler.asyRemoveContacts(diff.removed,curApp.getCurrentUser().id);
                                    this._asyFetchMembers(content.memberMCode,diff.added,diff.modified);
                                });
                            }

                        }
                    }

                });
            }catch (e){

            }

        }

        setTimeout(()=>{this._ping()},60000);
    }

    async _asyFetchMembers(remoteMemberMCode,added,modified){
       let ids = added.contact(modified);
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("fetchMembers",{members:ids})]);
        return new Promise((resolve,reject)=>{
            result[0]._sendMessage(result[1]).then((msg)=> {
                let members = msg.content.members;
                return ContactManager.asyRebuildMembers(remoteMemberMCode,ids,members);
            }).then(()=>{
                resolve();
            });
        });
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
                    let orgMCode = content.orgMCode;
                    let orgs = content.orgs;
                    let memberMCode = content.memberMCode;
                    let members = content.members;
                    let friends = content.friends;
                    OrgManager.asyResetOrgs(orgMCode,orgs,uid).then(function () {
                        return ContactManager.asyResetContacts(memberMCode,members,friends)
                    }).then(function () {
                        resolve();
                    })

                }
            }).catch((error)=>{
                reject(error);
            });
        });
    }

    async asyUnRegister(){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("unRegister")]);
        return result[0]._sendMessage(result[1]);
    }
}

module.exports=LKChannel;
