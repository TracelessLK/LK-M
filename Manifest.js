import ConfigManager from './common/core/ConfigManager'
import WSChannel from './lk/net/LKWSChannel'
import ChatManager from './lk/core/ChatManager'
import ContactManager from './lk/core/ContactManager'
import OrgManager from './lk/core/OrgManager'

import LKUserProvider from './lk/logic/provider/LKUserProvider'
import LKContactProvider from './lk/logic/provider/LKContactProvider'

ConfigManager.configure("WSChannel",WSChannel);
ConfigManager.configure("ChatManager",ChatManager);
ConfigManager.configure("ContactManager",ContactManager);
ConfigManager.configure("LKUserProvider",LKUserProvider);
ConfigManager.configure("LKContactProvider",LKContactProvider);


module.exports = ConfigManager;
