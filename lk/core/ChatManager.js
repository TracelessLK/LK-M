import EventTarget from '../../common/core/EventTarget'
import ContactManager from './ContactManager'
import LKChatProvider from '../logic/provider/LKChatProvider'
import LKContactProvider from '../logic/provider/LKContactProvider'
import LKDeviceProvider from '../logic/provider/LKDeviceProvider'
import LKChatHandler from '../logic/handler/LKChatHandler'
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
    //TODO 删除无hot chat关联的contact
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
                        members.push({id:m.id});
                    });
                    members.push({id:userId});
                }else{
                    let contact = await LKContactProvider.asyGet(chat.id);
                    members.push({id:contact.id});
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
        }
        let time = Date.now();
        let chat = this._recentChats[this._recentChatsIndex[chatId]];
        if(chat){
            if(!chat.key||time-chat.keyGenTime>3600000){
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

    getHotChatKeyReceived(chatId,senderUid,random){
        let curApp = Application.getCurrentApp();
        let randoms = this._hotChatRandomReceived[chatId];
        if(!randoms){
            randoms = {};

            this._hotChatRandomReceived[chatId] = randoms;
        }
        let sentRandom = randoms.senderUid;
        if(!sentRandom){
            sentRandom = {random:random,key:curApp.getCurrentRSA().decrypt(random)};
            randoms.senderUid = sentRandom;
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
        newMsgs.forEach((record)=>{
            readNewMsgs.push(record.id);
        });
        LKChatHandler.asyUpdateReadState(readNewMsgs,this.MESSAGE_READSTATE_READ);
        Application.getCurrentApp().getLKWSChannel().readReport(chatId,readNewMsgs);
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
    }


}


module.exports = new ChatManager();
