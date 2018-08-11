

import Chat from '../../store/Chat'
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
}
module.exports = new LKChatProvider();
