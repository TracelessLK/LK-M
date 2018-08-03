import ConfigManager from './common/core/ConfigManager'
import WSChannel from './lk/net/LKWSChannel'
import ChatManager from './lk/core/ChatManager'
import ContactManager from './lk/core/ContactManager'
import OrgManager from './lk/core/OrgManager'

ConfigManager.configure("WSChannel",WSChannel);
ConfigManager.configure("ChatManager",ChatManager);
ConfigManager.configure("ContactManager",ContactManager);
ConfigManager.configure("OrgManager",OrgManager);


module.exports = ConfigManager;
