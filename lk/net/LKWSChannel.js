import UUID from 'uuid/v4';
import EventTarget from '../../common/net/WSChannel'
import Application from '../LKApplication'
import CryptoJS from "crypto-js";

class LKChannel extends WSChannel{

    _callbacks={}
    _timeout:60000

    constructor(url){
        super(url,true);
        this._ping();
    }

    _onmessage(message){
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
            this.login();
    }

    _generateMsgId () {
        return UUID();
    }

    async _asyNewRequest (action,content,targets,chatId,lastChatMsg,preSentChatMsg) {
        let id = this._generateMsgId();
        let ps = [];
        ps.push(Application.getCurrentApp().asyGetTopOrgMCode());
        ps.push(Application.getCurrentApp().asyGetTopMemberMCode());
        if(chatId){
            ps.push(Application.getCurrentApp().getChatManager().getChat(chatId));
            ps.push(Application.getCurrentApp().getChatManager().asyGetChatMembers(chatId,true));
        }
        let result = await Promise.all(ps);

        let orgMCode = result[0];
        let memberMCode = result[1];
        let _content = chatId?CryptoJS.AES.encrypt(content, result[1].key).toString():content;
        let _targets = chatId?result[2]:targets;
        //let mCode = Application.getCurrentApp().getCurrentUser().mCode;

        return  {
            header:{
                version:"1.0",
                id:id,
                action:action,
                uid:Application.getCurrentApp().getCurrentUser().id,
                did:Application.getCurrentApp().getCurrentUser().deviceId,
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
            },
            sign:""
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
                reject({err:e.toString()});
            }

            setTimeout(()=>{
                if(this._callbacks[msgId]){
                    reject({err:"timeout"});
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

    async login(){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("login")]);
        return result[0]._sendMessage(result[1]);
    }

   async register(ip,port,uid,did,venderDid,pk,checkCode,qrCode){
        let msg = {uid:uid,did:did,venderDid:venderDid,pk:pk,checkCode:checkCode,qrCode:qrCode};
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("register",msg)]);
        return result[0]._sendMessage(result[1]);
    }

}

module.exports=LKChannel;