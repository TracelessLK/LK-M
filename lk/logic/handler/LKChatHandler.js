import Chat from '../../store/Chat'
import Record from '../../store/Record'
class LKChatHandler{
    asyAddSingleChat(userId,chatId,newMsgNum){
        return Chat.addSingleChat(userId,chatId,newMsgNum);
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
    asyUpdateNewMsgNum(userId,chatId,num){
        return Chat.updateNewMsgNum(userId,chatId,num);
    }
    asyUpdateReadState(msgIds,state){
        return Record.updateReadState(msgIds,state);
    }
    asyClear(userId){
        return Chat.clear(userId);
    }
}
module.exports = new LKChatHandler();

