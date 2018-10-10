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
import LKChatProvider from '../logic/provider/LKChatProvider'
import MFApplyManager from '../core/MFApplyManager'
import CryptoJS from "crypto-js";

class LKChannel extends WSChannel{

    _callbacks={};
    _timeout=60000;
    _chatMsgPool = new Map();

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
                handler.call(this,msg);
            }
        }
    }

    _reportMsgHandled(flowId,msgId){
        this.applyChannel().then((channel)=>{
            // let uid = Application.getCurrentApp().getCurrentUser().id;
            // let did = Application.getCurrentApp().getCurrentUser().deviceId;
            channel.send(JSON.stringify({header:{
                version:"1.0",
                flowId:flowId,
                // msgId:msgId,
                // uid:uid,
                // did:did,
                response:true
            }}));
        });
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
        if (option) {
          console.log(option)
        }
        let msg=  {
            header:{
                version:"1.0",
                id:(option&&option.id)||this._generateMsgId(),
                action:action,
                // uid:uid,
                // did:did,

                //target:_target
                // targets:_targets,
                time:option&&option.time||Date.now(),
                timeout:Application.getCurrentApp().getMessageTimeout()
            },
            body:{
                // content:_content
                // chatId:chatId,
                // relativeMsgId:relativeMsgId,
                // order:order
            }
        };
        if(option){
            let target = option.target;
            let targets = option.targets;
            if(target){
                msg.header.target = target;
            }
            if(targets){
                msg.header.targets = targets;
            }
        }

        msg.body.content = content;


        if(Application.getCurrentApp().getCurrentUser()){

            msg.header.uid = Application.getCurrentApp().getCurrentUser().id;
            msg.header.did = Application.getCurrentApp().getCurrentUser().deviceId;

            if(option){
                let chatId = option.chatId;
                let relativeMsgId = option.relativeMsgId;
                if(chatId){
                    let chat = await ChatManager.asyGetHotChatRandomSent(chatId);

                    msg.header.targets = option.targets||chat.members;
                    msg.body.isGroup = option.isGroup;
                    msg.body.chatId = chatId;
                    msg.body.relativeMsgId = relativeMsgId;
                    msg.body.order=option.order||ChatManager.getChatSendOrder(chatId);
                    msg.body.content = option.content||CryptoJS.AES.encrypt(JSON.stringify(content), chat.key).toString();
                    console.log({content: msg.body.content})
                }
            }

        }

        //let mCode = Application.getCurrentApp().getCurrentUser().mCode;



        return msg;
    }

    _sendMessage(req){
        const {header} = req
        const {action} = header
      const excludeAry = ['ping', 'login']
      if (!excludeAry.includes(action)) {
        console.log({sendMsg: req, action})
      }
        return new Promise((resolve,reject)=>{
            let msgId = req.header.id;
            this._callbacks[msgId] = (msg)=>{
              if (!excludeAry.includes(action)) {
                console.log({responseCallbackMsg: msg,req})
              }
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
                    reject({error:"timeout", req});
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
                                    //TODO mark the contact has been unregistered
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

    sendText(chatId,text,relativeMsgId,isGroup){
        let content = {type:ChatManager.MESSAGE_TYEP_TEXT,data:text};
        this._sendMsg(chatId,content,relativeMsgId,isGroup).catch(err => {
          console.log(err)
        })
    }
    sendGroupText(chatId,text,relativeMsgId){
        this.sendText(chatId,text,relativeMsgId,true)
    }

    async _sendMsg(chatId,content,relativeMsgId,isGroup){
        let curApp = Application.getCurrentApp();
        let userId = curApp.getCurrentUser().id;
        let did = curApp.getCurrentUser().deviceId;
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("sendMsg",content,{isGroup:isGroup,chatId:chatId,relativeMsgId:relativeMsgId})]);
        let msgId = result[1].header.id;
        let time = result[1].header.time;
        let curTime = Date.now();
        let relativeOrder = curTime;
        if(relativeMsgId){
            let relativeMsg = await LKChatProvider.asyGetMsg(userId,chatId,relativeMsgId);
            if(relativeMsg)
                relativeOrder = relativeMsg.receiveOrder;
        }
        await LKChatHandler.asyAddMsg(userId,chatId,msgId,userId,did,content.type,content.data,time,ChatManager.MESSAGE_STATE_SENDING,relativeMsgId,relativeOrder,curTime,result[1].body.order);
        ChatManager.fire("msgChanged",chatId);
        result[0]._sendMessage(result[1]).then((resp)=>{
            console.log({resp})
            const {content} = resp.body
            if(content && content.diff){
                const {diff} = content
                console.log({diff})
                let added = ChatManager.deviceChanged(chatId,diff);
                if(added&&added.length>0){
                    this._asyNewRequest("sendMsg2",content,{isGroup:isGroup,time:time,chatId:chatId,relativeMsgId:relativeMsgId,id:msgId,targets:added,order:result[1].header.order,content:result[1].body.content}).then((req)=>{
                        this._sendMessage(req).then(()=>{
                            LKChatHandler.asyUpdateMsgState(msgId,ChatManager.MESSAGE_STATE_SERVER_RECEIVE).then(()=>{
                                ChatManager.fire("msgChanged",chatId);
                            });
                        }).catch((error)=>{
                          console.log(error)
                            LKChatHandler.asyUpdateMsgState(msgId,ChatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE).then(()=>{
                                ChatManager.fire("msgChanged",chatId);
                            });
                        });
                    });
                }else{
                    LKChatHandler.asyUpdateMsgState(msgId,ChatManager.MESSAGE_STATE_SERVER_RECEIVE).then(()=>{
                        ChatManager.fire("msgChanged",chatId);
                    });
                }
            }else{
                LKChatHandler.asyUpdateMsgState(msgId,ChatManager.MESSAGE_STATE_SERVER_RECEIVE).then(()=>{
                    ChatManager.fire("msgChanged",chatId);
                });
            }
        }).catch((error)=>{
          console.log(error)
            LKChatHandler.asyUpdateMsgState(msgId,ChatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE).then(()=>{
                ChatManager.fire("msgChanged",chatId);
            });
        });
    }

    async msgDeviceDiffReportHandler(msg){
        let header = msg.header;
        let content = msg.body.content;
        let msgId = content.msgId;
        let chatId = content.chatId;
        let diff = content.diff;
        //TODO 记录人员设备更新是由服务端的哪个flowid引起，同一个人的设备的diff只处理上个flowid后的diff
        this._reportMsgHandled(header.flowId,header.id);
        if(diff){
            console.log({diff})
            let added = ChatManager.deviceChanged(chatId,diff);
            if(added&&added.length>0){
                let oldMsg = await LKChatProvider.asyGetMsg(Application.getCurrentApp().getCurrentUser().id,chatId,msgId);
                if(oldMsg){
                    this._asyNewRequest("sendMsg2",{type:oldMsg.type,data:oldMsg.content},{time:oldMsg.sendTime,chatId:chatId,relativeMsgId:oldMsg.relativeMsgId,id:oldMsg.id,targets:added,order:oldMsg.order}).then((req)=>{
                        this._sendMessage(req);
                    });
                }

            }


        }
    }

    _putChatMsgPool(chatId,msg){
        let msgs = this._chatMsgPool.get(chatId);
        if(!msgs){
            msgs = [];
            this._chatMsgPool.set(chatId,msgs);
        }
        msgs.push(msg);
    }
    async _checkChatMsgPool(chatId,relativeMsgId,relativeOrder){
        //获取所有relativeMsg是msg的消息
        let msgs = this._chatMsgPool.get(chatId);
        if(msgs){
           for(let i=0;i<msgs.length;i++){
               let msg = msgs[i];
               let header = msg.header;
               let body = msg.body;
               if(body.relativeMsgId===relativeMsgId){
                   let receiveOrder = await this._getReceiveOrder(chatId,relativeMsgId,header.uid,header.did,body.order);
                   this._receiveMsg(msg,relativeOrder,receiveOrder);
               }
           }
        }
    }

    async _receiveMsg(msg,relativeOrder,receiveOrder){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        let header = msg.header;
        let body = msg.body;
        let chatId = userId===header.uid?body.chatId:header.uid;
        let random = header.target.random;
        let key = ChatManager.getHotChatKeyReceived(chatId,header.did,random);
        var bytes  = CryptoJS.AES.decrypt(msg.body.content.toString(), key);
        let content = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

        await LKChatHandler.asyAddMsg(userId,chatId,header.id,header.uid,header.did,content.type,content.data,header.time,null,body.relativeMsgId,relativeOrder,receiveOrder,body.order);
        this._reportMsgHandled(header.flowId,header.id);
        this._checkChatMsgPool(chatId,header.id,receiveOrder);
        //await ChatManager.increaseNewMsgNum(chatId);
        ChatManager.fire("msgChanged",chatId);
    }

    async _getReceiveOrder(chatId,relativeMsgId,senderUid,senderDid,sendOrder){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        let nextMsg = await LKChatProvider.asyGetRelativeNextSendMsg(userId,chatId,relativeMsgId,senderUid,senderDid,sendOrder);
        let receiveOrder;
        if(!nextMsg){
            receiveOrder = Date.now();
        }else {
            receiveOrder = nextMsg.receiveOrder;
        }
        return receiveOrder;
    }

    sendMsg2Handler(msg){
        this.sendMsgHandler(msg);
    }

    async sendMsgHandler(msg){
        console.log({receivedMsg: msg})

        //TODO 处理消息重入或前置未达如本地还没有群
        let userId = Application.getCurrentApp().getCurrentUser().id;
        let header = msg.header;
        let body = msg.body;
        let senderUid = header.uid;
        let senderDid = header.did;
        let isGroup = body.isGroup;
        let chatId = isGroup?body.chatId:(userId===senderUid?body.chatId:senderUid);
        if(!isGroup)
            await ChatManager.asyEnsureSingleChat(chatId);
        let relativeMsgId = body.relativeMsgId;
        let sendOrder = body.order;
        let relativeOrder;
        let receiveOrder;
        if(relativeMsgId){
            let relativeMsg = await LKChatProvider.asyGetMsg(userId,chatId,relativeMsgId);
            if(relativeMsg){
                relativeOrder = relativeMsg.receiveOrder;
                receiveOrder = await this._getReceiveOrder(chatId,relativeMsgId,senderUid,senderDid,sendOrder);
            }else{
                this._putChatMsgPool(chatId,msg);
            }
        }else{
            relativeOrder = Date.now();
            receiveOrder = await this._getReceiveOrder(chatId,relativeMsgId,senderUid,senderDid,sendOrder);
        }
        if(relativeOrder&&receiveOrder){
            this._receiveMsg(msg,relativeOrder,receiveOrder,sendOrder)
        }
    }

    async readReport(chatId,serverIP,serverPort,msgIds){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("readReport",msgIds,{target:{id:chatId,serverIP:serverIP,serverPort:serverPort}})]);
        result[0]._sendMessage(result[1]).then((resp)=>{
            LKChatHandler.asyUpdateReadState(msgIds,ChatManager.MESSAGE_READSTATE_READREPORT);
        });
    }
    readReportHandler(msg){
        let msgIds = msg.body.content;
        LKChatHandler.asyUpdateMsgState(msgIds,ChatManager.MESSAGE_STATE_TARGET_READ).then(()=>{
            this._reportMsgHandled(msg.header.flowId,msg.header.id);
            ChatManager.fire("msgChanged",msg.header.id);
        });
    }

    async applyMF(contactId,serverIP,serverPort){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("applyMF",{
                name:Application.getCurrentApp().getCurrentUser().name,
                pic:Application.getCurrentApp().getCurrentUser().pic,
                mCode:Application.getCurrentApp().getCurrentUser().mCode
            },
            {target:{id:contactId,serverIP:serverIP,serverPort:serverPort}})]);
        return result[0]._sendMessage(result[1]);
    }
    applyMFHandler(msg){
        let contactId = msg.header.uid;
        let name = msg.body.content.name;
        let pic = msg.body.content.pic;
        let mCode = msg.body.content.mCode;
        let serverIP = msg.header.serverIP;
        let serverPort = msg.header.serverPort;
        MFApplyManager.asyAddNewMFApply({id:contactId,name:name,pic:pic,serverIP:serverIP,serverPort:serverPort,mCode:mCode}).then(()=>{
            this._reportMsgHandled(msg.header.flowId);
        });
    }
    async acceptMF(contactId,contactName,contactPic,serverIP,serverPort,contactMCode){
        let user = Application.getCurrentApp().getCurrentUser();
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("acceptMF",{accepter:{name:user.name,pic:user.pic,mCode:user.mCode},applyer:{name:contactName,pic:contactPic,mCode:contactMCode}},
            {target:{id:contactId,serverIP:serverIP,serverPort:serverPort}})]);
        return result[0]._sendMessage(result[1]);
    }
    acceptMFHandler(msg){
        let header = msg.header;
        let content = msg.body.content;
        let user = Application.getCurrentApp().getCurrentUser();
        let friend;
        if(header.uid===user.id){
            let target = content.target;
            friend = {id:target.id,serverIP:target.serverIP,serverPort:target.serverPort,name:content.applyer.name,pic:content.applyer.pic,mCode:content.applyer.mCode};
        }else{
            friend = {id:header.uid,serverIP:header.serverIP,serverPort:header.serverPort,name:content.accepter.name,pic:content.accepter.pic,mCode:content.accepter.mCode};
        }
        ContactManager.asyAddNewFriend(friend).then(()=>{
            this._reportMsgHandled(header.flowId);
        });
    }
    //members:{id,name,pic,serverIP,serverPort}
    async addGroupChat(chatId,name,members){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("addGroupChat",{chatId:chatId,name:name,members:members})]);
        return result[0]._sendMessage(result[1]);
    }
    async addGroupChatHandler(msg){
        let content = msg.body.content;
        let chatId = content.chatId;
        let name = content.name;
        let members = content.members;
        ChatManager.addGroupChat(chatId,name,members).then( ()=> {
            this._reportMsgHandled(msg.header.flowId);
        });
    }
    async addGroupMembers(chatId,newMembers){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("addGroupMembers",{chatId:chatId,members:newMembers})]);
        return result[0]._sendMessage(result[1]);
    }
    async addGroupMembersHandler(msg){
        let content = msg.body.content;
        let newMembers = content.members;
        let chatId = content.chatId;
        let user = Application.getCurrentApp().getCurrentUser();
        let inNewMembers = false;
        for(let i=0;i<newMembers.length;i++){
            let member = newMembers[i];
            if(member.id===user.id){
                inNewMembers = true;
                break;
            }
        }
        if(inNewMembers){
            let name = content.name;
            ChatManager.addGroupChat(chatId,name,newMembers);
        }else{
            let chat = await LKChatProvider.asyGetChat(user.id,chatId);
            if(chat){
                ChatManager.addGroupMembers(chatId,newMembers);
            }
        }
    }
    async setUserName(name){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("setUserName",{name:name})]);
        return result[0]._sendMessage(result[1]);
    }
    async setUserPic(pic){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("setUserPic",{pic:pic})]);
        return result[0]._sendMessage(result[1]);
    }
}

module.exports=LKChannel;
