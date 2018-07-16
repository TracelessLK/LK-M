

import Chat from '../../store/Chat'
class LKChatProvider{
    asyGetChat(chatId){
        return Chat.getChat(chatId);
    }
    asyGeChattMembers(chatId){
        return Chat.getChatMembers(chatId);
    }
}
module.exports = new LKChatProvider();
