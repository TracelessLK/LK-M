const EventTarget = require('../../common/core/EventTarget')
const ContactManager = require('./ContactManager')
const LKChatProvider = require('../logic/provider/LKChatProvider')
const LKContactProvider = require('../logic/provider/LKContactProvider')
const LKDeviceProvider = require('../logic/provider/LKDeviceProvider')
const LKChatHandler = require('../logic/handler/LKChatHandler')
const LKDeviceHandler = require('../logic/handler/LKDeviceHandler')
const Chat = require('../store/Chat')
const Contact = require('../store/Contact')
const Record = require('../store/Record')
const UUID = require('uuid/v4')
const RSAKey = require("react-native-rsa")
const Application = require('../LKApplication')
class ChatManager extends EventTarget{


    constructor(){
        super();
        //承担 发送消息的random缓存
        this._recentChats = [];//
        this._recentChatsIndex={};
        this._maxRecent = 6;

        //接收消息的random缓存
        this._hotChatRandomReceived = {}

        //all chat newmsgnum
        // _allChatNewMsgNums = {}

        this.MESSAGE_STATE_SENDING=0
        this.MESSAGE_STATE_SERVER_NOT_RECEIVE=1
        this.MESSAGE_STATE_SERVER_RECEIVE=2
        this.MESSAGE_STATE_TARGET_RECEIVE=3
        this.MESSAGE_STATE_TARGET_READ=4

        this. MESSAGE_TYPE_TEXT=0
        this.MESSAGE_TYPE_IMAGE=1
        this.MESSAGE_TYPE_FILE=2
        this.MESSAGE_TYPE_AUDIO=3

        this.MESSAGE_READSTATE_READ=1
        this.MESSAGE_READSTATE_READREPORT=2

        this._sendOrderSeed = Date.now()
        this._allChatSendOrder = {}
    }

    init(user){
        this._recentChats = [];//
        this._recentChatsIndex={};
        this._hotChatRandomReceived = {};
        // this._allChatNewMsgNums = {};
        this._sendOrderSeed = Date.now();
        this._allChatSendOrder = {};
        if(user){
            this._ckReportReadstate();
        }
    }

    //TODO 在chat的成员变化后更新缓存

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
                    let contact = await LKContactProvider.asyGet(userId,chat.id);
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

    /**
     *  ensure single chat exist
     * @param contactId
     * @returns {Promise}
     */
    asyEnsureSingleChat(contactId){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        return new Promise((resovle)=>{
            LKChatProvider.asyGetChat(userId,contactId).then((chat)=>{
                if(chat){
                    resovle(true);
                }else{
                    LKChatHandler.asyAddSingleChat(userId,contactId).then(()=>{
                        this.fire("recentChanged")
                        resovle(true);
                    });
                }
            })
        });
    }


    /**
     * read chat msg
     * @param chatId
     * @param limit
     * @returns {Promise.<{msgs: *, newMsgs: *}>}
     */
    async asyReadMsgs(chatId,limit){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        let records = await LKChatProvider.asyGetMsgs(userId,chatId,limit);
        // this._allChatNewMsgNums[chatId] = 0;
        // LKChatHandler.asyUpdateNewMsgNum(userId,chatId,0);
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
        await LKChatHandler.asyUpdateReadState(readNewMsgs,this.MESSAGE_READSTATE_READ);
        this.fire('recentChanged');
       let num = await LKChatProvider.asyGetAllMsgNotReadNum(userId)
       this.fire("msgBadgeChanged",num);
       // console.log({num})
        LKChatProvider.asyGetChat(userId,chatId).then((chat)=>{
            targets.forEach((v,k)=>{
                Contact.get(userId,k).then((contact)=>{
                    Application.getCurrentApp().getLKWSChannel().readReport(chatId,chat.isGroup,k,contact.serverIP,contact.serverPort,v);
                });
            });
        });


        return {msgs:records,newMsgs:newMsgs};
    }

    //each 5 minutes check readstate and send readreport

    async _ckReportReadstate(){
        let user = Application.getCurrentApp().getCurrentUser();
        if(user){
            let chats = await LKChatProvider.asyGetAll(user.id);
            let ps = [];
            if(chats){
                chats.forEach((chat)=>{
                    ps.push(Record.getReadNotReportMsgs(user.id,chat.id));
                });
               let rs = await Promise.all(ps);
               for(let i=0;i<rs.length;i++){
                   let msgs = rs[i];
                   if(msgs){
                       let targets = new Map();
                       msgs.forEach((record)=>{
                           if(!targets.has(record.senderUid)){
                               targets.set(record.senderUid,[]);
                           }
                           targets.get(record.senderUid).push(record.id);
                       });
                       targets.forEach((v,k)=>{
                           Contact.get(user.id,k).then((contact)=>{
                               Application.getCurrentApp().getLKWSChannel().readReport(chats[i].id,chats[i].isGroup,k,contact.serverIP,contact.serverPort,v);
                           });
                       });
                   }
               }
            }

            setTimeout(()=>{this._ckReportReadstate()},5*60*1000);
        }
    }

    // async _initAllChatNewMsgNums(userId){
    //     let chats = await LKChatProvider.asyGetAll(userId);
    //     chats.forEach((chat)=>{
    //         this._allChatNewMsgNums[chat.id] = chat.newMsgNum;
    //     });
    // }

    /**
     * get new msg num
     * @param chatId
     * @returns {number}
     */
    async asyGetNewMsgNum(chatId){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        let newMsgs = await LKChatProvider.asyGetMsgsNotRead(userId,chatId);
        return newMsgs.length;
        // let newMsgNum = this._allChatNewMsgNums[chatId];
        // return newMsgNum?newMsgNum:0;
    }

    // increaseNewMsgNum(chatId){
    //     let newMsgNum = this._allChatNewMsgNums[chatId];
    //     this._allChatNewMsgNums[chatId]= (newMsgNum?newMsgNum:0)+1;
    //     let userId = Application.getCurrentApp().getCurrentUser().id;
    //     // LKChatHandler.asyUpdateNewMsgNum(userId,chatId,this._allChatNewMsgNums[chatId]);
    //
    // }

    getChatSendOrder(chatId){
        let sendOrder = this._allChatSendOrder[chatId];
        if(!sendOrder){
            sendOrder = 0;
        }
        sendOrder++;
        this._allChatSendOrder[chatId]=sendOrder;
        return this._sendOrderSeed+sendOrder;
    }

    deviceChanged(chatId,changedMembers){
        let returnAdded = [];
        // console.log({changedMembers})
        changedMembers.forEach(function(changed){
            LKDeviceHandler.asyAddDevices(changed.id,changed.added);
            LKDeviceHandler.asyRemoveDevices(changed.id,changed.removed);
        });
        // let chat = this._recentChats[this._recentChatsIndex[chatId]];
        this._recentChats.forEach((chat)=>{
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
                            let addDevices = [];
                            added.forEach(function (addDevice) {
                                let rsa = new RSAKey();
                                rsa.setPublicString(addDevice.pk);
                                let random = rsa.encrypt(chat.key);
                                let newD = {id:addDevice.id,random:random};
                                localDevices.push(newD);
                                if(chat.id===chatId)
                                    addDevices.push(newD);
                            });
                            if(chat.id===chatId)
                                returnAdded.push({id:member.id,serverIP:member.serverIP,serverPort:member.serverPort,devices:addDevices});
                        }

                    }
                }
            }
        });

        return returnAdded;
    }

    /**
     * clear recent list
     */
    clear(){
        LKChatHandler.asyClear(Application.getCurrentApp().getCurrentUser().id).then(()=>{
            this.fire("recentChanged");
        });

    }

    /**
     * create new group chat
     * @param name
     * @param members members:{id,name,pic,serverIP,serverPort}
     * @returns {Promise.<Promise|*>}
     */

    async newGroupChat(name,members){
        let chatId = UUID();
        await this.addGroupChat(chatId,name,members,true);
        return Application.getCurrentApp().getLKWSChannel().addGroupChat(chatId,name,members);
    }

    async addGroupChat(chatId,name,members,local){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        const chat = await Chat.getChat(userId,chatId);
        if(!chat){
            if(!local)
                await Contact.addNewGroupContactIFNotExist(members,userId);
            await Promise.all([Chat.addGroupChat(userId,chatId,name),Chat.addGroupMembers(chatId,members)])
            this.fire("recentChanged");
        }
    }

    /**
     * add new group members
     * @param chatId
     * @param newMembers
     * @returns {Promise.<void>}
     */
    async newGroupMembers(chatId,newMembers){
        // let oldMembers = await LKChatProvider.asyGetGroupMembers(chatId);
        // let curMembers = [];
        // oldMembers.forEach(function (m) {
        //     curMembers.push(m.id);
        // });
        await Application.getCurrentApp().getLKWSChannel().addGroupMembers(chatId,newMembers);
        await Chat.addGroupMembers(chatId,newMembers);
        this.fire('groupMemberChange', chatId)
    }
    async addGroupMembers(chatId,newMembers){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        await Promise.all([Contact.addNewGroupContactIFNotExist(newMembers,userId),Chat.addGroupMembers(chatId,newMembers)]);

    }
    async asyResetGroups(groups,userId){
        let ps = [];
        groups.forEach(function (group) {
            ps.push(Chat.addGroupChat(userId,group.id,group.name));
            ps.push(Chat.addGroupMembers(group.id,group.members));
        })
        await Promise.all(ps);

    }

    /**
     * leave the group
     * @param chatId
     */
    async leaveGroup(chatId){
        await Application.getCurrentApp().getLKWSChannel().leaveGroup(chatId);
        return this.deleteGroup(chatId);
    }

    deleteGroup(chatId){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        return Chat.deleteGroup(userId,chatId);
    }

    deleteGroupMember(chatId,memberId){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        return Chat.deleteGroupMember(userId,chatId,memberId);
    }

    async removeAll(){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        await Chat.removeAll(userId);
        await Record.removeAll(userId);

    }
    async msgReadReport(reporterUid,chatId,msgIds,state){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        let chat = await LKChatProvider.asyGetChat(userId,chatId);
        if(chat){
            return Record.msgReadReport(userId,chatId,msgIds,reporterUid,state,chat.isGroup);
        }
    }

    /**
     * get read report detail of group msg
     * @param chatId
     * @param msgId
     * @returns [{name,state}]
     */
    asyGetGroupMsgReadReport(chatId,msgId){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        return Record.getGroupMsgReadReport(userId,chatId,msgId);
    }

    /**
     * update group name
     * @param chatId
     * @param name
     * @returns {Promise.<*|Promise>}
     */
    async asySetGroupName(chatId,name){
        await Application.getCurrentApp().getLKWSChannel().setGroupName(chatId,name);
        return this.asyUpdateGroupName(chatId,name)
    }

    asyUpdateGroupName(chatId,name){
        let userId = Application.getCurrentApp().getCurrentUser().id;
        return Chat.setGroupName(userId,chatId,name);
    }

}


module.exports = new ChatManager();
