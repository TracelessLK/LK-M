const {engine} = require('@lk/LK-C')

const ChatManager = engine.get('ChatManager')
const Application = engine.getApplication()

const instance = ChatManager

const update = async () => {
  ChatManager.fire('recentChanged')
  const lkApplication = Application.getCurrentApp()
  const user = lkApplication.getCurrentUser()
  const num = await ChatManager.asyGetAllMsgNotReadNum(user.id)
  ChatManager.fire('msgBadgeChanged', num)
}
instance.on('msgRead', update)

instance.on('msgReceived', update)

module.exports = instance
