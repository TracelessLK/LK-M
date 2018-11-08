const Chat = require('../../store/Chat')
const Record = require('../../store/Record')
class LKChatHandler{
    asyAddSingleChat(userId,chatId){
        return Chat.addSingleChat(userId,chatId);
    }
    asyAddGroupMembers(chatId,members){
        return Chat.addGroupMembers(chatId,members);
    }
    asyAddMsg(userId,chatId,msgId,senderUid,senderDid,type,content,sendTime,state,relativeMsgId,relativeOrder,receiveOrder,sendOrder){
        return Record.addMsg(userId,chatId,msgId,senderUid,senderDid,type,content,sendTime,state,relativeMsgId,relativeOrder,receiveOrder,sendOrder);
    }
    asyUpdateMsgState(userId,chatId,msgIds,state){
        return Record.updateMsgState(userId,chatId,msgIds,state)
    }
    asyUpdateReadState(msgIds,state){
        return Record.updateReadState(msgIds,state);
    }
    asyClear(userId){
        return Chat.clear(userId);
    }
}
module.exports = new LKChatHandler();

