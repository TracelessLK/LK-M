
import Chat from '../../store/Chat'
import Record from '../../store/Record'
class LKChatProvider{
    asyGetAll(userId){
        return Chat.getAll(userId);
    }
    asyGetChat(userId,chatId){
        return Chat.getChat(userId,chatId);
    }
    asyGetGroupMembers(chatId){
        return Chat.getGroupMembers(chatId);
    }
    asyGetMsgs(userId,chatId,limit){
        return Record.getMsgs(userId,chatId,limit);
    }
    asyGetMsgsNotRead(userId,chatId){
        return Record.getMsgsNotRead(userId,chatId);
    }
    asyGetMsg(userId,chatId,msgId){
        return Record.getMsg(userId,chatId,msgId);
    }
    asyGetRelativePreSendMsg(userId,chatId,relativeMsgId,senderUid,senderDid,sendOrder){
        return Record.getRelativePreSendMsg(userId,chatId,relativeMsgId,senderUid,senderDid,sendOrder);
    }
    asyGetRelativeNextSendMsg(userId,chatId,relativeMsgId,senderUid,senderDid,sendOrder){
        return Record.getRelativeNextSendMsg(userId,chatId,relativeMsgId,senderUid,senderDid,sendOrder);
    }
}
module.exports = new LKChatProvider();
