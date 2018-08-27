import ConfigManager from './common/core/ConfigManager'
import WSChannel from './lk/net/LKWSChannel'
import ChatManager from './lk/core/ChatManager'
import ContactManager from './lk/core/ContactManager'
import OrgManager from './lk/core/OrgManager'
import UserManager from './lk/core/UserManager'
import MagicCodeManager from './lk/core/MagicCodeManager'

ConfigManager.configure('WSChannel', WSChannel)
ConfigManager.configure('ChatManager', ChatManager)
ConfigManager.configure('ContactManager', ContactManager)
ConfigManager.configure('OrgManager', OrgManager)
ConfigManager.configure('UserManager', UserManager)
ConfigManager.configure('MagicCodeManager', MagicCodeManager)

module.exports = ConfigManager
