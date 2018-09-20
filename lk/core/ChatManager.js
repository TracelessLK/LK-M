import EventTarget from '../../common/core/EventTarget'
import ContactManager from './ContactManager'
import LKChatProvider from '../logic/provider/LKChatProvider'
import LKContactProvider from '../logic/provider/LKContactProvider'
import LKDeviceProvider from '../logic/provider/LKDeviceProvider'
import LKChatHandler from '../logic/handler/LKChatHandler'
import LKDeviceHandler from '../logic/handler/LKDeviceHandler'
import Chat from '../store/Chat'
import Contact from '../store/Contact'
import UUID from 'uuid/v4';
import RSAKey from "react-native-rsa";
import Application from '../LKApplication'
class ChatManager extends EventTarget{
    //承担 发送消息的random缓存
    _recentChats = [];//
    _recentChatsIndex={};
    _maxRecent = 6;
    _hotContacts = {};

    //接收消息的random缓存
    _hotChatRandomReceived = {}

    //all chat newmsgnum
    _allChatNewMsgNums = {}

    MESSAGE_STATE_SENDING=0
    MESSAGE_STATE_SERVER_NOT_RECEIVE=1
    MESSAGE_STATE_SERVER_RECEIVE=2
    MESSAGE_STATE_TARGET_RECEIVE=3
    MESSAGE_STATE_TARGET_READ=4

    MESSAGE_TYEP_TEXT=0
    MESSAGE_TYPE_IMAGE=1
    MESSAGE_TYPE_FILE=2

    MESSAGE_READSTATE_READ=1
    MESSAGE_READSTATE_READREPORT=2

    _sendOrderSeed = Date.now()
    _allChatSendOrder = {}

    constructor(){
        super();
        // ContactManager.on("mCodeChanged",this._doContactMCodeChange);
        // ContactManager.on("mCodeChanged",this._doContactMCodeChange);
        // ContactManager.on("deviceAdded",this._doContactDeviceAdded);
        // ContactManager.on("deviceRemoved",this._doContactDeviceRemoved);
    }

    start(userId){
        this._initAllChatNewMsgNums(userId);
    }

    //TODO监听mcode的变化
    _doContactMCodeChange(detail){

    }
    _doContactDeviceAdded(detail){

    }
    _doContactDeviceRemoved(detail){

    }
    //TODO监听chat下的成员列表的变化
    notifyChatMemberAdded(detail){

    }

    notifyChatMemberRemoved(detail){

    }

    //发消息时用
    /**
     *
     * _recentChatsIndex {chatId:int}
     * _recentChats [chat]
     * chat:id name, ... ,members,key,keyGenTime
     * members[{id:contactId,devices:[{id:did,random:}]}]
     *
     * @param chatId
     * @param checkChatKey
     * @returns {Promise.<Array>}
     */
    async asyGetHotChatRandomSent(chatId){
        let curUser = Application.getCurrentApp().getCurrentUser();
        let userId = curUser.id;
        if(this._recentChatsIndex[chatId]===undefined){
            //chat&members
            let chat = await LKChatProvider.asyGetChat(userId,chatId);
            if(chat){
                let members=[];
                if(chat.isGroup){
                    let gm = await LKChatProvider.asyGetGroupMembers(chatId);
                    gm.forEach(function (m) {
                        let nm = {id:m.id};
                        members.push(nm);
                        if(m.serverIP){
                            nm.serverIP = m.serverIP;
                            nm.serverPort = m.serverPort;
                        }
                    });
                }else{
                    let contact = await LKContactProvider.asyGet(chat.id);
                    let nm = {id:contact.id};
                    if(contact.serverIP){
                        nm.serverIP = contact.serverIP;
                        nm.serverPort = contact.serverPort;
                    }
                    members.push(nm);
                    members.push({id:userId});
                }

                //delete the oldest
                if(this._recentChats.length>=this._maxRecent){
                    let oldChatId = this._recentChats[0].chatId;
                    delete this._recentChatsIndex[oldChatId];
                    this._recentChats.splice(0,1);
                }
                chat.key = UUID();
                chat.keyGenTime = Date.now();


                chat.members = members;
                this._recentChats.push(chat);
                this._recentChatsIndex[chatId] = this._recentChats.length-1;
                let ps = [];
                members.forEach((contact)=>{
                    ps.push(LKDeviceProvider.asyGetAll(contact.id));
                });
                //devices
                let result = await Promise.all(ps);
               for(let i=0;i<members.length;i++){
                   let member = members[i];
                   member.devices = [];
                   let devices = result[i];
                   devices.forEach((device)=>{
                       if(member.id===userId&&device.id===curUser.deviceId){
                           return;
                       }
                       let rsa = new RSAKey();
                       rsa.setPublicString(device.publicKey);
                       member.devices.push({id:device.id,random:rsa.encrypt(chat.key)});
                   });
               }
            }
        }else{
            let curIndex = this._recentChatsIndex[chatId];
            if(curIndex!=this._recentChats.length-1){
                let chat = this._recentChats[curIndex];
                this._recentChats.splice(curIndex,1);
                this._recentChats.push(chat);
                this._recentChatsIndex[chatId] = this._recentChats.length-1;
            }
        }
        let time = Date.now();
        let chat = this._recentChats[this._recentChatsIndex[chatId]];
        if(chat){
            if(time-chat.keyGenTime>3600000){
                chat.key = UUID();
                chat.keyGenTime = time;
                let members = chat.members;
                members.forEach((contact)=>{
                    contact.devices.forEach((device)=>{
                        let rsa = new RSAKey();
                        rsa.setPublicString(device.publicKey);
                        device.random = rsa.encrypt(chat.key);
                    });
                });
            }
        }
        return chat;
    }

    getHotChatKeyReceived(chatId,senderDid,random){
        let curApp = Application.getCurrentApp();
        let randoms = this._hotChatRandomReceived[chatId];
        if(!randoms){
            randoms = {};

            this._hotChatRandomReceived[chatId] = randoms;
        }
        let sentRandom = randoms[senderDid];
        if(!sentRandom){
            sentRandom = {random:random,key:curApp.getCurrentRSA().decrypt(random)};
            randoms[senderDid] = sentRandom;
        }
        if(sentRandom.random!==random){
            sentRandom.random = random;
            sentRandom.key = curApp.getCurrentRSA().decrypt(random);
        }
        return sentRandom.key;

    }

    // single chat
    asyEnsureSingleChat(contactId){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        return new Promise((resovle)=>{
            LKChatProvider.asyGetChat(userId,contactId).then((chat)=>{
                if(chat){
                    resovle();
                }else{
                    LKChatHandler.asyAddSingleChat(userId,contactId).then(()=>{
                        this.fire("recentChanged")
                        resovle();
                    });
                }
            })
        });
    }

    async asyReadMsgs(chatId,limit){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        let records = await LKChatProvider.asyGetMsgs(userId,chatId,limit);
        this._allChatNewMsgNums[chatId] = 0;
        LKChatHandler.asyUpdateNewMsgNum(userId,chatId,0);
        let newMsgs = await LKChatProvider.asyGetMsgsNotRead(userId,chatId);
        let readNewMsgs = [];
        let targets = new Map();
        newMsgs.forEach((record)=>{
            readNewMsgs.push(record.id);
            if(!targets.has(record.senderUid)){
                targets.set(record.senderUid,[]);
            }
            targets.get(record.senderUid).push(record.id);
        });
        LKChatHandler.asyUpdateReadState(readNewMsgs,this.MESSAGE_READSTATE_READ);
        targets.forEach((v,k)=>{
            Contact.get(k).then((contact)=>{
                Application.getCurrentApp().getLKWSChannel().readReport(k,contact.serverIP,contact.serverPort,v);
            });
        });

        return {msgs:records,newMsgs:newMsgs};
    }

    //TODO each 3 minutes check readstate and send readreport

    async _initAllChatNewMsgNums(userId){
        let chats = await LKChatProvider.asyGetAll(userId);
        chats.forEach((chat)=>{
            this._allChatNewMsgNums[chat.id] = chat.newMsgNum;
        });
    }

    getNewMsgNum(chatId){
        let newMsgNum = this._allChatNewMsgNums[chatId];
        return newMsgNum?newMsgNum:0;
    }

    increaseNewMsgNum(chatId){
        let newMsgNum = this._allChatNewMsgNums[chatId];
        this._allChatNewMsgNums[chatId]= (newMsgNum?newMsgNum:0)+1;
        let userId = Application.getCurrentApp().getCurrentUser().id;
        LKChatHandler.asyUpdateNewMsgNum(userId,chatId,this._allChatNewMsgNums[chatId]);
        //TODO newmsgnum 不采用字段记录 而是通过记录readstate去计算 在启动时只会读取一次
    }

    getChatSendOrder(chatId){
        let sendOrder = this._allChatSendOrder[chatId];
        if(!sendOrder){
            sendOrder = 0;
        }
        sendOrder++;
        this._allChatSendOrder[chatId]=sendOrder;
        return this._sendOrderSeed+sendOrder;
    }

    //TODO 其他包含了该成员的chat的缓存也需要更新
    deviceChanged(chatId,changedMembers){
        let returnAdded = [];
        changedMembers.forEach(function(changed){
            LKDeviceHandler.asyAddDevices(changed.id,changed.added);
            LKDeviceHandler.asyRemoveDevices(changed.id,changed.removed);
        });
        let chat = this._recentChats[this._recentChatsIndex[chatId]];
        if(chat){
            let members = chat.members;
            for(let i=0;i<members.length;i++){
                let member = members[i];
                for(let j=0;j<changedMembers.length;j++){
                    let changedMember = changedMembers[j];
                    if(member.id===changedMember.id){
                        let localDevices = member.devices;
                        let removed = changedMember.removed;
                        let added = changedMember.added;
                        for(let k=0;k<localDevices.length;k++){
                            if(removed.indexOf(localDevices[k].id)!=-1){
                                localDevices.splice(k,1);
                                k--;
                            }
                        }
                        if(added.length>0){
                            let addDevices = {id:member.id,devices:[]};
                            added.forEach(function (addDevice) {
                                let rsa = new RSAKey();
                                rsa.setPublicString(addDevice.pk);
                                let random = rsa.encrypt(chat.key);
                                let newD = {id:addDevice.id,random:random};
                                localDevices.push(newD);
                                addDevices.devices.push(newD);
                            });
                            returnAdded.push(addDevices);
                        }

                    }
                }
            }
        }
        return returnAdded;
    }

    clear(){
        LKChatHandler.asyClear(Application.getCurrentApp().getCurrentUser().id).then(()=>{
            this.fire("recentChanged");
        });

    }
    //members:{id,name,pic,serverIP,serverPort}

    async newGroupChat(name,members){
        let chatId = UUID();
        await this.addGroupChat(chatId,name,members,true);
        return Application.getCurrentApp().getLKWSChannel().addGroupChat(chatId,name,members);
    }

    async addGroupChat(chatId,name,members,local){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        if(!local)
            await Contact.addNewGroupContactIFNotExist(members,userId);
        await Chat.addGroupChat(userId,chatId,name);
        await Chat.addGroupMembers(chatId,members);
        this.fire("recentChanged");
    }
    async asyResetGroups(groups){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        let ps = [];
        groups.forEach(function (group) {
            ps.push(Chat.addGroupChat(userId,group.id,group.name));
            ps.push(Chat.addGroupMembers(group.id,group.members));
        })
        await Promise.all(ps);

    }

}


module.exports = new ChatManager();
