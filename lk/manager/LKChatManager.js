const {engine} = require('@lk/LK-C')
const ChatManager = engine.get('ChatManager')
let Application = engine.getApplication()
const lkApplication = Application.getCurrentApp()
const user = lkApplication.getCurrentUser()

class LKChatManager extends ChatManager {

}

const instance = new LKChatManager()

const update = async () => {
  this.fire('recentChanged')
  let num = await ChatManager.asyGetAllMsgNotReadNum(user.id)
  this.fire('msgBadgeChanged', num)
}
instance.on('msgRead', update)

instance.on('msgReceived', update)

module.exports = instance
