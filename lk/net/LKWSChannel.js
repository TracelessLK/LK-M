import UUID from 'uuid/v4';
import WSChannel from '../../common/net/WSChannel'
import Application from '../LKApplication'
import ChatManager from '../core/ChatManager'
import OrgManager from '../core/OrgManager'
import ContactManager from "../core/ContactManager"
import MagicCodeManager from "../core/MagicCodeManager"
import LKContactProvider from '../logic/provider/LKContactProvider'
import LKContactHandler from '../logic/handler/LKContactHandler'
import LKChatHandler from '../logic/handler/LKChatHandler'
import LKDeviceProvider from '../logic/provider/LKDeviceProvider'
import CryptoJS from "crypto-js";

class LKChannel extends WSChannel{

    _callbacks={}
    _timeout=60000

    constructor(url){
        super(url,true);
        this._ping();
    }

    _handleMsg(msg){
        let header = msg.header;
        let isResponse = header.response;
        let action = header.action;
        if(isResponse){
            let msgId = header.msgId;
            let callback = this._callbacks[msgId];
            if(callback){
                callback(msg);
            }
        }else if(action){
            let handler = this[action+"Handler"];
            if(handler){
                handler(msg).then(()=>{
                    this.applyChannel().then((channel)=>{
                        let uid = Application.getCurrentApp().getCurrentUser().id;
                        let did = Application.getCurrentApp().getCurrentUser().deviceId;
                        channel.send(JSON.stringify({header:{
                            version:"1.0",
                            msgId:msg.id,
                            uid:uid,
                            did:did,
                            response:true
                        }}));
                    });
                });
            }
        }
    }

    _onmessage = (message)=>{
        let msg = JSON.parse(message.data);
        if(msg.forEach){
            msg.forEach((m)=> {
                this._handleMsg(m);
            })
        }else{
            this._handleMsg(msg);
        }
    }

    _onreconnect(){
        if(Application.getCurrentApp().getCurrentUser())
            this.asyLogin();
    }

    _generateMsgId () {
        return UUID();
    }

    async _asyNewRequest (action,content,option) {
        let msg=  {
            header:{
                version:"1.0",
                id:this._generateMsgId(),
                action:action,
                // uid:uid,
                // did:did,
                // chatId:chatId,
                // lastOppositeMsg:lastOppositeMsg,
                //target:_target
                // targets:_targets,
                time:Date.now(),
                timeout:Application.getCurrentApp().getMessageTimeout()
            },
            body:{
                // content:_content
            }
        };
        if(option){
            let target = option.target;
            if(target){
                msg.header.target = target;
            }
        }

        msg.body.content = content;


        if(Application.getCurrentApp().getCurrentUser()){

            msg.header.uid = Application.getCurrentApp().getCurrentUser().id;
            msg.header.did = Application.getCurrentApp().getCurrentUser().deviceId;

            if(option){
                let chatId = option.chatId;
                let relativeMsg = option.relativeMsg;
                if(chatId){
                    let chat = await ChatManager.asyGetHotChatRandomSent(chatId);

                    msg.header.chatId = chatId;
                    msg.header.targets = chat.members;
                    msg.header.relativeMsg = relativeMsg;
                    msg.body.content = CryptoJS.AES.encrypt(JSON.stringify(content), chat.key).toString();

                }
            }

        }

        //let mCode = Application.getCurrentApp().getCurrentUser().mCode;



        return msg;
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
                    result = await Promise.all([MagicCodeManager.asyGetOrgMCode(),MagicCodeManager.asyGetMemberMCode()]);
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
       return result[0]._sendMessage(result[1]);
    }

    async asyUnRegister(){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("unRegister")]);
        return result[0]._sendMessage(result[1]);
    }

    sendText(contactId,text,relativeMsg,preMsg){
        let content = {type:ChatManager.MESSAGE_TYEP_TEXT,data:text};
        this._sendMsg(contactId,content);
    }

    async _sendMsg(contactId,content){
        let curApp = Application.getCurrentApp();
        let userId = curApp.getCurrentUser().id;
        let did = curApp.getCurrentUser().deviceId;
        let chat = await ChatManager.asyGetHotChatRandomSent(contactId);
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("sendMsg",content,{chatId:contactId})]);
        let msgId = result[1].header.id;
        let time = result[1].header.time;
        await LKChatHandler.asyAddMsg(userId,contactId,msgId,userId,did,content.type,content.data,time,ChatManager.MESSAGE_STATE_SENDING);
        ChatManager.fire("msgChanged",contactId);
        result[0]._sendMessage(result[1]).then((resp)=>{
            LKChatHandler.asyUpdateMsgState(msgId,ChatManager.MESSAGE_STATE_SERVER_RECEIVE).then(()=>{
                ChatManager.fire("msgChanged",contactId);
            });
        }).catch(()=>{
            LKChatHandler.asyUpdateMsgState(msgId,ChatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE).then(()=>{
                ChatManager.fire("msgChanged",contactId);
            });
        });
    }

    async sendMsgHandler(msg){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        let header = msg.header;
        let msgId = header.id;
        let senderUid = header.uid;
        let senderDid = header.did;
        let target = header.target;
        let random = target.random;
        let key = ChatManager.getHotChatKeyReceived(senderUid,senderUid,random);
        let encrytedContent = msg.body.content;
        var bytes  = CryptoJS.AES.decrypt(encrytedContent.toString(), key);
        let content = bytes.toString(CryptoJS.enc.Utf8);
        let time = header.time;
        let chatId = userId===senderUid?header.chatId:senderUid;

        await ChatManager.asyEnsureSingleChat(chatId);
        await LKChatHandler.asyAddMsg(userId,chatId,msgId,senderUid,senderDid,content.type,content.data,time);
        await ChatManager.increaseNewMsgNum(chatId);
        ChatManager.fire("msgChanged",chatId);
        //TODO 处理排序 消息加order字段
    }

    async readReport(contactId,msgIds){
        let devices = await LKDeviceProvider.asyGetAll(contactId);
        let target = {id:contactId,devices:[]};
        devices.forEach(function (device) {
            target.devices.push(device.id);
        });
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("readReport",msgIds,{target:target})]);
        result[0]._sendMessage(result[1]).then((resp)=>{
            LKChatHandler.asyUpdateReadState(msgIds,ChatManager.MESSAGE_READSTATE_READREPORT);
        });
    }
    readReportHandler(msg){
        let msgIds = msg.body.content;
        LKChatHandler.asyUpdateMsgState(msgIds,ChatManager.MESSAGE_STATE_TARGET_READ).then(()=>{
            ChatManager.fire("msgChanged",msg.header.id);
        });
    }

    async asySendOrgMsg(orgs){

    }

    async asyCreateGroupChat(chatId,name,members){

    }

    async asyAddChatMember(chatId,name,member){

    }

    async asyRemoveChatMember(){

    }

    async asyLeaveChat(chatId){

    }

    async asySendChatMessage(chatId){

    }
}

module.exports=LKChannel;
