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
        let orgMCode = null;
        let memberMCode = null;
        let _content = null;
        let _targets = null;
        let uid = null;
        let did = null;
        if(Application.getCurrentApp().getCurrentUser()){
            uid = Application.getCurrentApp().getCurrentUser().id;
            did = Application.getCurrentApp().getCurrentUser().deviceId;
            let ps = [];
            ps.push(Application.getCurrentApp().asyGetTopOrgMCode());
            ps.push(Application.getCurrentApp().asyGetTopMemberMCode());
            if(chatId){
                ps.push(Application.getCurrentApp().getChatManager().getChat(chatId));
                ps.push(Application.getCurrentApp().getChatManager().asyGetChatMembers(chatId,true));
            }
            let result = await Promise.all(ps);
            orgMCode = result[0];
            memberMCode = result[1];
            if(chatId){
                _content = CryptoJS.AES.encrypt(content, result[2].key).toString();
                _targets = result[3];
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
                memberMCode:memberMCode,
                orgMCode:orgMCode,

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

   async _ping(){
        let deprecated = false;
        if(!this._lastPongTime){
            this._lastPongTime = Date.now();
        }else if(this._ws&&!this._foreClosed&&Date.now()-this._lastPongTime>180000){
            try{
                this._ws.close();
            }catch (e){

            }
            delete this._ws;
            deprecated=true;
        }
        if(!deprecated&&!this._foreClosed){
            try{
                let result = await Promise.all([this.applyChannel(),this._asyNewRequest("ping")]);
                result[0]._sendMessage(result[1]).then(()=>{
                    this._lastPongTime = Date.now();
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
        return new Promise((resolve,reject)=>{
            let msg = {uid:uid,did:did,venderDid:venderDid,pk:pk,checkCode:checkCode,qrCode:qrCode,description:description};
            let result = await Promise.all([this.applyChannel(),this._asyNewRequest("register",msg)]);
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
