
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
        return Record.getMsgs(userId,chatId,limit)
    }
    asyGetMsgsNotRead(userId,chatId){
        return Record.getMsgsNotRead(userId,chatId)
    }
}
module.exports = new LKChatProvider();
