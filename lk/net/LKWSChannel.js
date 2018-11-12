const UUID = require('uuid/v4')
const WSChannel = require('../../common/net/WSChannel')
const Application = require('../LKApplication')
const ChatManager = require('../core/ChatManager')
const OrgManager = require('../core/OrgManager')
const ContactManager = require("../core/ContactManager")
const MagicCodeManager = require("../core/MagicCodeManager")
const LKContactProvider = require('../logic/provider/LKContactProvider')
const LKContactHandler = require('../logic/handler/LKContactHandler')
const LKChatHandler = require('../logic/handler/LKChatHandler')
const LKDeviceProvider = require('../logic/provider/LKDeviceProvider')
const LKChatProvider = require('../logic/provider/LKChatProvider')
const MFApplyManager = require('../core/MFApplyManager')
const FlowCursor = require('../store/FlowCursor')
const LZBase64String = require('../../common/util/lz-base64-string')
const CryptoJS = require("crypto-js")

class LKChannel extends WSChannel{

    constructor(url){
        super(url,true);
        this._callbacks={};
        this._timeout=30000;
        this._chatMsgPool = new Map();
        this._flowPool = new Map();
        this._ping();
    }

    _putFlowPool(preFlowId,msg){
        let ary = this._flowPool.get(preFlowId);
        if(!ary){
            ary = [];
            this._flowPool.set(preFlowId,ary);
        }
        ary.push(msg);
    }

    _resolveFlowPool(lastFlowId){
        let ary = this._flowPool.get(lastFlowId);
        if(ary){
            ary.forEach((msg)=>{
                let action = msg.header.action;
                let handler = this[action+"Handler"];
                if(handler){
                    handler.call(this,msg);
                }
            });
        }
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
            // console.log({msgRecieved: msg})
            let handler = this[action+"Handler"];
            if(handler){
                if(header.preFlowId){
                    let userId = Application.getCurrentApp().getCurrentUser().id;
                    FlowCursor.getLastFlowId(userId,header.flowType).then((lastFlowId)=>{
                        if(lastFlowId){
                            if(header.preFlowId===lastFlowId){
                                handler.call(this,msg);
                            }else{
                                this._putFlowPool(header.preFlowId,msg);
                            }
                        }else{
                            handler.call(this,msg);
                        }
                    });
                }else{
                    handler.call(this,msg);
                }
            }
        }
    }

    _reportMsgHandled(flowId,flowType){
        if(flowType){
            let userId = Application.getCurrentApp().getCurrentUser().id;
            FlowCursor.setLastFlowId(userId,flowType,flowId).then(()=>{
                this._resolveFlowPool(flowId);
            });
        }

        this.applyChannel().then((channel)=>{
            channel.send(JSON.stringify({header:{
                version:"1.0",
                flowId:flowId,
                response:true
            }}));
        });
    }

    _onmessage(message){
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
          // console.log(option)
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
                    // msg.body.content = option.content||CryptoJS.AES.encrypt(JSON.stringify(content), chat.key).toString();
                    msg.body.content = option.content||JSON.stringify(content);
                    // console.log({content: msg.body.content})
                }
            }

        }
        return msg;
    }

    __sendReq(req,timeout){
        return new Promise((resolve,reject)=>{
            let msgId = req.header.id;
            let callback = this._callbacks[msgId];
            callback._tryTimes++;
            try{
                super.send(JSON.stringify(req));
            }catch (e){
                if(callback._tryTimes<2)
                    this.__sendReq(req,timeout).catch(()=>{
                        reject({error:"timeout", req});
                    });
                else
                    reject({error:"timeout", req});
            }

            setTimeout(()=>{
                if(this._callbacks[msgId]){
                    if(callback._tryTimes<2)
                        this.__sendReq(req,timeout).catch(()=>{
                            reject({error:"timeout", req});
                        });
                    else
                        reject({error:"timeout", req});
                }

            },timeout*callback._tryTimes);
        });
    }

    _sendMessage(req,timeout){
        return new Promise((resolve,reject)=>{
            let msgId = req.header.id;
            let callback = this._callbacks[msgId] = (msg)=>{
                delete this._callbacks[msgId];
                resolve(msg);
            }
            callback._tryTimes = 0;
            let _timeout = timeout||this._timeout;
            this.__sendReq(req,_timeout).catch((err)=>{
                reject(err)
            })
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
       let ids = added.concat(modified);
       if(ids.length>0){
           let result = await Promise.all([this.applyChannel(),this._asyNewRequest("fetchMembers",{members:ids})]);
           return new Promise((resolve,reject)=>{
               result[0]._sendMessage(result[1]).then((msg)=> {
                   let members = msg.body.content.members;
                   return ContactManager.asyRebuildMembers(remoteMemberMCode,ids,members);
               }).then(()=>{
                   resolve();
               });
           });
       }

    }

    async asyLogin(){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("login",{venderDid:Application.getCurrentApp().getVenderId()})]);
         result[0]._sendMessage(result[1]).then((msg)=>{
             if(!msg.body.content.err){
                 Application.getCurrentApp().setLogin(Application.getCurrentApp().getCurrentUser())
             }
         })
    }

  async asyGetAllDetainedMsg(){
    let result = await Promise.all([this.applyChannel(),this._asyNewRequest("getAllDetainedMsg")]);
    return result[0]._sendMessage(result[1]);
  }

   async asyRegister(ip,port,uid,did,venderDid,pk,checkCode,qrCode,description){
       let msg = {uid:uid,did:did,venderDid:venderDid,pk:pk,checkCode:checkCode,qrCode:qrCode,description:description};
       let result = await Promise.all([this.applyChannel(),this._asyNewRequest("register",msg)]);
       return result[0]._sendMessage(result[1],60000);
    }

    async asyUnRegister(){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("unRegister")]);
        return result[0]._sendMessage(result[1]);
    }

    sendText(chatId,text,relativeMsgId,isGroup){
        let content = {type:ChatManager.MESSAGE_TYPE_TEXT,data:text};
        this._sendMsg(chatId,content,relativeMsgId,isGroup);
    }
    sendImage(chatId,imgData,width,height,relativeMsgId,isGroup){
        let content = {type:ChatManager.MESSAGE_TYPE_IMAGE,data:{data:imgData,width:width,height:height}};
        return this._sendMsg(chatId,content,relativeMsgId,isGroup);
    }
    sendAudio(chatId,audioData,audioExt,relativeMsgId,isGroup){
        let content = {type:ChatManager.MESSAGE_TYPE_AUDIO,data:{data:audioData,ext:audioExt}};
        return this._sendMsg(chatId,content,relativeMsgId,isGroup);
    }
    async retrySend(chatId,msgId){
        let curApp = Application.getCurrentApp();
        let userId = curApp.getCurrentUser().id;
        let result = await Promise.all([LKChatProvider.asyGetChat(userId,chatId),LKChatProvider.asyGetMsg(userId,chatId,msgId,true)]);
        let chat = result[0];
        let oldMsg = result[1];
        if(oldMsg){
            LKChatHandler.asyUpdateMsgState(userId,chatId,msgId,ChatManager.MESSAGE_STATE_SENDING).then(()=>{
                ChatManager.fire("msgChanged",chatId);
            });
            if(oldMsg.type===ChatManager.MESSAGE_TYPE_IMAGE||oldMsg.type===ChatManager.MESSAGE_TYPE_AUDIO){
                oldMsg.content.data =  LZBase64String.compressToUTF16(oldMsg.content.data);
                oldMsg.content.compress = true;
            }
            let result = await Promise.all([this.applyChannel(),this._asyNewRequest("sendMsg",{type:oldMsg.type,data:oldMsg.content},{isGroup:chat.isGroup,time:oldMsg.sendTime,chatId:chatId,relativeMsgId:oldMsg.relativeMsgId,id:oldMsg.id,order:oldMsg.order})]);
            result[0]._sendMessage(result[1]).then((resp)=>{
                LKChatHandler.asyUpdateMsgState(userId,chatId,msgId,ChatManager.MESSAGE_STATE_SERVER_RECEIVE).then(()=>{
                    ChatManager.fire("msgChanged",chatId);
                });
            }).catch((error)=>{
                LKChatHandler.asyUpdateMsgState(userId,chatId,msgId,ChatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE).then(()=>{
                    ChatManager.fire("msgChanged",chatId);
                });
            });
        }
    }
    sendGroupText(chatId,text,relativeMsgId){
        this.sendText(chatId,text,relativeMsgId,true)
    }
    sendGroupImage(chatId,imgData,width,height,relativeMsgId){
        this.sendImage(chatId,imgData,width,height,relativeMsgId,true);
    }
    sendGroupAudio(chatId,audioData,audioExt,relativeMsgId){
        this.sendAudio(chatId,audioData,audioExt,relativeMsgId,true);
    }

    async _sendMsg(chatId,content,relativeMsgId,isGroup){
        let curApp = Application.getCurrentApp();
        let userId = curApp.getCurrentUser().id;
        let did = curApp.getCurrentUser().deviceId;
        let sendContent = content;
        if(content.type===ChatManager.MESSAGE_TYPE_IMAGE){
            sendContent = {type:content.type,data:{width:content.data.width,height:content.data.height,compress:true}};
            sendContent.data.data = LZBase64String.compressToUTF16(content.data.data);
        }else if(content.type===ChatManager.MESSAGE_TYPE_AUDIO){
            sendContent = {type:content.type,data:{compress:true,ext:content.data.ext}};
            sendContent.data.data = LZBase64String.compressToUTF16(content.data.data);
        }
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("sendMsg",sendContent,{isGroup:isGroup,chatId:chatId,relativeMsgId:relativeMsgId})]);
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
                LKChatHandler.asyUpdateMsgState(userId,chatId,msgId,ChatManager.MESSAGE_STATE_SERVER_RECEIVE).then(()=>{
                    ChatManager.fire("msgChanged",chatId);
                });
        }).catch((error)=>{
            LKChatHandler.asyUpdateMsgState(userId,chatId,msgId,ChatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE).then(()=>{
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
        if(diff){
            let added = ChatManager.deviceChanged(chatId,diff);
            if(added&&added.length>0){
                let userId = Application.getCurrentApp().getCurrentUser().id;
                let result = await Promise.all([LKChatProvider.asyGetChat(userId,chatId),LKChatProvider.asyGetMsg(userId,chatId,msgId,true)]);
                let chat = result[0] ;
                let oldMsg = result[1] ;
                if(oldMsg){
                    this._asyNewRequest("sendMsg2",{type:oldMsg.type,data:oldMsg.content},{isGroup:chat.isGroup,time:oldMsg.sendTime,chatId:chatId,relativeMsgId:oldMsg.relativeMsgId,id:oldMsg.id,targets:added,order:oldMsg.order}).then((req)=>{
                        this._sendMessage(req).then((resp)=>{
                            LKChatHandler.asyUpdateMsgState(userId,chatId,msgId,ChatManager.MESSAGE_STATE_SERVER_RECEIVE).then(()=>{
                                ChatManager.fire("msgChanged",chatId);
                            });
                        }).catch((error)=>{
                            LKChatHandler.asyUpdateMsgState(userId,chatId,msgId,ChatManager.MESSAGE_STATE_SERVER_NOT_RECEIVE).then(()=>{
                                ChatManager.fire("msgChanged",chatId);
                            });
                        });
                    });
                }else{
                    this._reportMsgHandled(header.flowId,header.flowType);
                }

            }else{
                this._reportMsgHandled(header.flowId,header.flowType);
            }
        }else{
            this._reportMsgHandled(header.flowId,header.flowType);
        }
    }

    _putChatMsgPool(chatId,msg){
        let msgs = this._chatMsgPool.get(chatId);
        if(!msgs){
            msgs = new Map();
            this._chatMsgPool.set(chatId,msgs);
        }
        msgs.set(msg.header.id,msg);
    }
    async _checkChatMsgPool(chatId,relativeMsgId,relativeOrder){
        let msgs = this._chatMsgPool.get(chatId);
        if(msgs){
            let ps = [];
            let followMsgIds = [];
            msgs.forEach((msg,msgId)=>{
                let header = msg.header;
                let body = msg.body;
                if(body.relativeMsgId===relativeMsgId){
                    ps.push(this._getReceiveOrder(chatId,relativeMsgId,header.uid,header.did,body.order));
                    followMsgIds.push(header.id);
                }
            });
            let orders = await Promise.all(ps);
            for(let i=0;i<orders.length;i++){
                let receiveOrder = orders[i];
                let msg = msgs.get(followMsgIds[i]);
                this._receiveMsg(chatId,msg,relativeOrder,receiveOrder);
            }
        }
    }

    async _receiveMsg(chatId,msg,relativeOrder,receiveOrder){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        let header = msg.header;
        let body = msg.body;
        let random = header.target.random;
        let key = ChatManager.getHotChatKeyReceived(chatId,header.did,random);
        // var bytes  = CryptoJS.AES.decrypt(msg.body.content.toString(), key);
        // let content = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        // const msgDecrypted = bytes.toString(msg.body.content)
        const msgDecrypted = msg.body.content
        let content = JSON.parse(msgDecrypted);
        let state = userId===header.uid?ChatManager.MESSAGE_STATE_SERVER_RECEIVE:null;
        if((content.type===ChatManager.MESSAGE_TYPE_IMAGE||content.type===ChatManager.MESSAGE_TYPE_AUDIO)&&content.data.compress){
            content.data.data = LZBase64String.decompressFromUTF16(content.data.data);
        }
        await LKChatHandler.asyAddMsg(userId,chatId,header.id,header.uid,header.did,content.type,content.data,header.time,state,body.relativeMsgId,relativeOrder,receiveOrder,body.order);
        this._reportMsgHandled(header.flowId,header.flowType);
        this._checkChatMsgPool(chatId,header.id,receiveOrder);
        ChatManager.fire("msgChanged",chatId);
      let num = await LKChatProvider.asyGetAllMsgNotReadNum(userId)
        ChatManager.fire("msgBadgeChanged",num);
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
        let userId = Application.getCurrentApp().getCurrentUser().id;
        let header = msg.header;
        let body = msg.body;
        let senderUid = header.uid;
        let senderDid = header.did;
        let isGroup = body.isGroup;
        let chatId = isGroup?body.chatId:(userId===senderUid?body.chatId:senderUid);
        let exits;
        if(isGroup){
            exits = await LKChatProvider.asyGetChat(userId,chatId);
        }else{
            exits = await ChatManager.asyEnsureSingleChat(chatId);
        }
        if(exits){
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
                    if(header.RFExist===0){//relative msg flow has been deleted by server as a receive report or timeout or this is a new device after relative msg or eat by ghost
                        let order = Date.now();
                        this._receiveMsg(chatId,msg,order,order);
                    }else{
                        this._putChatMsgPool(chatId,msg);
                    }
                }
            }else{
                relativeOrder = Date.now();
                receiveOrder = await this._getReceiveOrder(chatId,relativeMsgId,senderUid,senderDid,sendOrder);
            }
            if(relativeOrder&&receiveOrder){
                this._receiveMsg(chatId,msg,relativeOrder,receiveOrder)
            }
        }

    }

    async readReport(chatId,isGroup,senderUid,serverIP,serverPort,msgIds){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("readReport",{msgIds:msgIds,chatId:chatId,isGroup:isGroup},{target:{id:senderUid,serverIP:serverIP,serverPort:serverPort}})]);
        result[0]._sendMessage(result[1]).then((resp)=>{
            LKChatHandler.asyUpdateReadState(msgIds,ChatManager.MESSAGE_READSTATE_READREPORT);
        });
    }
    readReportHandler(msg){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        let content = msg.body.content;
        let msgIds = content.msgIds;
        let isGroup = content.isGroup;
        let chatId = isGroup?content.chatId:(userId===msg.header.uid?content.chatId:msg.header.uid);

        ChatManager.msgReadReport(msg.header.uid,chatId,msgIds,ChatManager.MESSAGE_STATE_TARGET_READ).then((isAllUpdate)=>{
            if(isAllUpdate)
                this._reportMsgHandled(msg.header.flowId,msg.header.flowType);
            ChatManager.fire("msgChanged",chatId);
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
            this._reportMsgHandled(msg.header.flowId,msg.header.flowType);
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
            this._reportMsgHandled(header.flowId,header.flowType);
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
            this._reportMsgHandled(msg.header.flowId,msg.header.flowType);
        });
    }
    async addGroupMembers(chatId,newMembers){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("addGroupMembers",{chatId:chatId,members:newMembers})]);
        return result[0]._sendMessage(result[1]);
    }
    async addGroupMembersHandler(msg){
        let header = msg.header;
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
            let oldMembers = content.oldMembers;

            ChatManager.addGroupChat(chatId,name,newMembers.concat(oldMembers)).then(()=>{
                this._reportMsgHandled(header.flowId,header.flowType);
            });
        }else{
            let chat = await LKChatProvider.asyGetChat(user.id,chatId);
            if(chat){
                ChatManager.addGroupMembers(chatId,newMembers).then(()=>{
                    this._reportMsgHandled(header.flowId,header.flowType);
                });
            }
        }
    }
    async setGroupName(chatId,name){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("setGroupName",{chatId:chatId,name:name})]);
        return result[0]._sendMessage(result[1]);
    }
    async setGroupNameHandler(msg){
        let header = msg.header;
        let chatId = msg.body.content.chatId;
        let name = msg.body.content.name;
        ChatManager.asyUpdateGroupName(chatId,name).then(()=>{
            this._reportMsgHandled(header.flowId,header.flowType);
        });
    }
    async leaveGroup(chatId){
        let result = await Promise.all([this.applyChannel(),this._asyNewRequest("leaveGroup",{chatId:chatId})]);
        return result[0]._sendMessage(result[1]);
    }
    async leaveGroupHandler(msg){
        let header = msg.header;
        let sender = header.uid;
        let chatId = msg.body.content.chatId;
        let user = Application.getCurrentApp().getCurrentUser();
        if(sender===user.id){
            ChatManager.deleteGroup(chatId).then(()=>{
                this._reportMsgHandled(header.flowId,header.flowType);
            });
        }else{
            ChatManager.deleteGroupMember(chatId,sender).then(()=>{
                this._reportMsgHandled(header.flowId,header.flowType);
            });
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
  _onerror (event) {
      // console.log('connectionFail')
    this.fire('connectionFail', event)
  }
}

module.exports=LKChannel;
