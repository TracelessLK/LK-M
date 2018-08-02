import Application from '../LKApplication'
import ContactManager from './ContactManager'
import LKChatProvider from '../logic/provider/LKChatProvider'
import LKDeviceProvider from '../logic/provider/LKDeviceProvider'
class ChatManager{
    //承担 chat->members基本信息的缓存管理
    _recentChats = [];//
    _recentChatsIndex={};
    _maxRecent = 6;
    _hotContacts = {};

    constructor(){
        ContactManager.on("mCodeChanged",this._doContactMCodeChange);
        ContactManager.on("mCodeChanged",this._doContactMCodeChange);
        ContactManager.on("deviceAdded",this._doContactDeviceAdded);
        ContactManager.on("deviceRemoved",this._doContactDeviceRemoved);
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

    //TODO 删除无hot chat关联的contact
    async asyGetChatMembers(chatId,checkChatKey){
        if(this._recentChatsIndex[chatId]===undefined){
            //chat&members
            let p1 = LKChatProvider.asyGetChat(chatId);
            let p2 = LKChatProvider.asyGetChatMembers(chatId);
            let result = await Promise.all([p1,p2]);
            if(this._recentChats.length>=this._maxRecent){
                let oldChatId = this._recentChats[0].chatId;
                delete this._recentChatsIndex[oldChatId];
                this._recentChats.splice(0,1);
            }
            let chat = result[0];
            let members = result[1];
            if(checkChatKey){
                chat.key = UUID();
                chat.keyGenTime = Date.now();
            }


            chat.members = [];
            this._recentChats.push(chat);
            this._recentChatsIndex[chatId] = this._recentChats.length-1;
            let ps = [];
            members.forEach((contact)=>{
                chat.members.push(contact.id);
                let oldContact = this._hotContacts[contact.id];
                if(!oldContact){
                    ps.push(LKDeviceProvider.asyGetAll(contact.id));
                    contact.devices=[];
                }
                this._hotContacts[contact.id] = contact;
            });
            //devices
            let result2 = await Promise.all(ps);
            result2.forEach((devices)=>{
                if(checkChatKey){
                    devices.forEach((device)=>{
                        let rsa = new RSAKey();
                        rsa.setPublicString(device.publicKey);
                        device.random = rsa.encrypt(chat.key);
                    });
                }
                if(devices.length>0){
                    let contact = this._hotContacts[devices[0].contactId];
                    contact.devices = devices;
                }
            });
        }
        let time = Date.now();
        let chat = this._recentChats[this._recentChatsIndex[chatId]];
        if(checkChatKey&&(!chat.key||time-chat.keyGenTime>3600000)){
            chat.key = UUID();
            chat.keyGenTime = time;
        }
        let members = chat.members;
        let result = [];
        members.forEach((contactId)=>{
            let contact = this._hotContacts[contactId];
            if(checkChatKey&&chat.keyGenTime==time){
                contact.devices.forEach((device)=>{
                    let rsa = new RSAKey();
                    rsa.setPublicString(device.publicKey);
                    device.random = rsa.encrypt(chat.key);
                });
            }
            result.push(contact);
        });
        return result;
    }

    async asyGetChat(chatId){
        await this.asyGetChatMembers(chaId);
        let chat = this._recentChats[this._recentChatsIndex[chatId]];
        return chat;
    }
}


module.exports = new ChatManager();
