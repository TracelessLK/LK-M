const ConfigManager = require('./common/core/ConfigManager')
const WSChannel = require('./lk/net/LKWSChannel')
const ChatManager = require('./lk/core/ChatManager')
const ContactManager = require('./lk/core/ContactManager')
const OrgManager = require('./lk/core/OrgManager')
const UserManager = require('./lk/core/UserManager')
const MagicCodeManager = require('./lk/core/MagicCodeManager')
const MFApplyManager = require('./lk/core/MFApplyManager')

ConfigManager.configure('WSChannel', WSChannel)
ConfigManager.configure('ChatManager', ChatManager)
ConfigManager.configure('ContactManager', ContactManager)
ConfigManager.configure('OrgManager', OrgManager)
ConfigManager.configure('UserManager', UserManager)
ConfigManager.configure('MagicCodeManager', MagicCodeManager)
ConfigManager.configure('MFApplyManager', MFApplyManager)

module.exports = ConfigManager
