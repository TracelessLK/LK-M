import Chat from '../../store/Chat'
class LKChatHandler{
    asyAddNewChat(chatId,name,newMsgNum){
        return Chat.addNewChat(chatId,name,newMsgNum);
    }
    asyAddNewMembers(chatId,members){
        return Chat.addNemMembers(chatId,members);
    }
}
module.exports = new LKChatHandler();

