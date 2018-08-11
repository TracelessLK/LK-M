import Chat from '../../store/Chat'
import Record from '../../store/Record'
class LKChatHandler{
    asyAddSingleChat(userId,chatId,newMsgNum){
        return Chat.addSingleChat(userId,chatId,newMsgNum);
    }
    asyAddGroupMembers(chatId,members){
        return Chat.addGroupMembers(chatId,members);
    }
    asyAddMsg(userId,chatId,msgId,senderUid,senderDid,type,content,sendTime,state){
        return Record.addMsg(userId,chatId,msgId,senderUid,senderDid,type,content,sendTime,state);
    }
    asyUpdateMsgState(msgId,state){
        return Record.updateMsgState(msgId,state)
    }
}
module.exports = new LKChatHandler();

